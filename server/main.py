from enum import Enum
from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from supabase import create_client, Client
import os
import spotipy
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import time
import requests

load_dotenv()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Roomify API")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Enum for device type
class DeviceType(str, Enum):
    lights = "lights"
    screen = "screen"
    aroma_diffuser = "aroma_diffuser"

# Request body model
class RemoteCreate(BaseModel):
    name: str
    device_type: DeviceType
    board_serial: str

class TriggerRequest(BaseModel):
    board_serial: str
    device_header: str
    command: str
class PlayPlaylistRequest(BaseModel):
    access_token: str
    playlist_uri: str
class PlayPresetRequest(BaseModel):
    preset_id: str
    board_serial: str

def refresh_spotify_token(refresh_token: str):
    res = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": os.environ["SPOTIFY_CLIENT_ID"],
            "client_secret": os.environ["SPOTIFY_CLIENT_SECRET"],
        },
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        },
    )

    if res.status_code != 200:
        raise Exception(f"Failed to refresh token: {res.text}")

    data = res.json()

    return {
        "access_token": data["access_token"],
        "refresh_token": data.get("refresh_token"),  # may or may not be returned
        "expires_at": int(time.time() * 1000) + (data["expires_in"] * 1000),
    }

def get_valid_spotify_token(supabase, board_serial: str):
    token_res = supabase.table("spotify_connections") \
        .select("access_token, refresh_token, expires_at") \
        .eq("board_serial", board_serial) \
        .single() \
        .execute()

    if not token_res.data:
        raise Exception("Missing Spotify connection")

    tokens = token_res.data

    # If still valid (> 1 min buffer)
    if tokens["expires_at"] > int(time.time() * 1000) + 60000:
        return tokens

    # Otherwise refresh
    updated = refresh_spotify_token(tokens["refresh_token"])

    # persist update
    supabase.table("spotify_connections") \
        .update({
            "access_token": updated["access_token"],
            "refresh_token": updated.get("refresh_token", tokens["refresh_token"]),
            "expires_at": updated["expires_at"],
        }) \
        .eq("board_serial", board_serial) \
        .execute()

    return {
        "access_token": updated["access_token"],
        "refresh_token": updated.get("refresh_token", tokens["refresh_token"]),
        "expires_at": updated["expires_at"],
    }

@app.get('/')
def index():
    return "Roomify server is running."

@app.get("/remotes/{board_serial}")
async def get_remotes(board_serial: str = Path(..., description="Serial number of the board")):
    response = supabase.table("remotes").select("*").eq("board_serial", board_serial).execute()
    
    if hasattr(response, "error") and response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    return {"board_serial": board_serial, "remotes": response.data}

@app.get("/presets/{board_serial}")
async def get_presets(board_serial: str = Path(..., description="Serial number of the board")):
    response = supabase.table("presets").select("*").eq("board_serial", board_serial).execute()
    
    if hasattr(response, "error") and response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    return {"board_serial": board_serial, "presets": response.data}

@app.post("/presets/play")
async def play_preset(req: PlayPresetRequest):
    preset_res = supabase.table("presets") \
        .select("*") \
        .eq("id", req.preset_id) \
        .single() \
        .execute()

    preset = preset_res.data

    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")

    button_ids = preset.get("button_ids", [])
    playlist_uri = preset.get("playlist_uri")

    buttons_res = supabase.table("buttons") \
        .select("id, command, device_header") \
        .in_("id", button_ids) \
        .execute()

    buttons = buttons_res.data or []

    try:
        token_data = get_valid_spotify_token(supabase, req.board_serial)
        access_token = token_data["access_token"]

        if playlist_uri:
            sp = spotipy.Spotify(auth=access_token)
            sp.start_playback(context_uri=playlist_uri)

        queued = []

        for btn in buttons:
            res = supabase.table("commands").insert({
                "board_serial": req.board_serial,
                "device_header": btn["device_header"],
                "command": btn["command"],
                "status": "pending"
            }).execute()

            queued.append(res.data)

    except spotipy.SpotifyException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Preset executed",
        "playlist_uri": playlist_uri,
        "commands_queued": len(queued)
    }
@app.post("/remotes")
async def add_remote(remote: RemoteCreate):
    board_resp = supabase.table("boards").select("*").eq("serial_number", remote.board_serial).execute()
    
    if hasattr(board_resp, "error") and board_resp.error:
        raise HTTPException(status_code=400, detail=f"Error checking board: {board_resp.error.message}")
    
    if not board_resp.data:
        insert_board_resp = supabase.table("boards").insert({
            "serial_number": remote.board_serial
        }).execute()
        
        if insert_board_resp.error:
            raise HTTPException(status_code=400, detail=f"Error inserting board: {insert_board_resp.error.message}")

    response = supabase.table("remotes").insert({
        "name": remote.name,
        "device_type": remote.device_type.value,
        "board_serial": remote.board_serial
    }).execute()
    
    if hasattr(response, "error") and response.error:
        raise HTTPException(status_code=400, detail=f"Error inserting remote: {response.error.message}")
    
    return {"message": "Remote added successfully", "data": response.data}

@app.get("/buttons/{remote_id}")
async def get_buttons(remote_id: str = Path(..., description="UUID of the remote")):
    response = supabase.table("buttons") \
        .select("*") \
        .eq("remote_id", remote_id) \
        .execute()
    
    if hasattr(response, "error") and response.error:
        raise HTTPException(
            status_code=400, 
            detail=f"Database error: {response.error.message}"
        )
    
    return {
        "remote_id": remote_id,
        "buttons": response.data
    }

@app.get("/commands/{board_serial}")
async def get_commands(board_serial: str):
    resp = supabase.table("commands") \
        .select("*") \
        .eq("board_serial", board_serial) \
        .eq("status", "pending") \
        .execute()
    
    return resp.data

@app.post("/trigger")
async def trigger(req: TriggerRequest):
    response = supabase.table("commands").insert({
        "board_serial": req.board_serial,
        "device_header": req.device_header,
        "command": req.command,
        "status": "pending"
    }).execute()

    return {"message": "Command queued", "data": response.data}

@app.post("/commands/{id}/complete")
async def complete_command(id: str):
    supabase.table("commands") \
        .update({"status": "done"}) \
        .eq("id", id) \
        .execute()
    
@app.post("/playlists/play")
async def play_playlist(payload: PlayPlaylistRequest):
    try:
        sp = spotipy.Spotify(auth=payload.access_token)
        sp.start_playback(context_uri=payload.playlist_uri)

        return {
            "success": True,
            "message": "Playback started",
            "playlist": payload.playlist_uri,
        }

    except spotipy.SpotifyException as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))