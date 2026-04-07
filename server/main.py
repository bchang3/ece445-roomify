from enum import Enum
from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv


load_dotenv()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Roomify API")

# Enum for device type
class DeviceType(str, Enum):
    lights = "lights"
    screen = "screen"
    aroma_diffuser = "aroma_diffuser"

# Request body model
class RemoteCreate(BaseModel):
    name: str
    device_type: DeviceType

@app.get('/')
def index():
    return "Roomify server is running."

@app.get("/remotes/{board_serial}")
async def get_remotes(board_serial: str = Path(..., description="Serial number of the board")):
    response = supabase.table("remotes").select("*").eq("board_serial", board_serial).execute()
    
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    return {"board_serial": board_serial, "remotes": response.data}

@app.post("/remotes")
async def add_remote(remote: RemoteCreate):

    board_resp = supabase.table("boards").select("*").eq("serial_number", remote.board_serial).execute()
    if board_resp.error:
        raise HTTPException(status_code=400, detail=board_resp.error.message)
    
    if not board_resp.data: 
        insert_board_resp = supabase.table("boards").insert({
            "serial_number": remote.board_serial
        }).execute()
        if insert_board_resp.error:
            raise HTTPException(status_code=400, detail=insert_board_resp.error.message)

    response = supabase.table("remotes").insert({
        "name": remote.name,
        "device_type": remote.device_type.value,
        "board_serial": remote.board_serial
    }).execute()
    
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    return {"message": "Remote added successfully", "data": response.data}