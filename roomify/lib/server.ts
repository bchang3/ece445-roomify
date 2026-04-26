import { supabase } from "./supabase";
import {
  SpotifyPlaylist,
  Remote,
  RemoteButton,
  TokenBundle,
  Preset,
} from "./types";

export async function getValidSpotifyToken(
  tokens: TokenBundle,
): Promise<TokenBundle> {
  const buffer = 60 * 1000; // 1 minute buffer

  const isExpired = Date.now() > tokens.expiresAt - buffer;

  if (!isExpired) {
    return tokens;
  }
  if (!tokens.refreshToken) {
    throw new Error("No refresh token found!");
  }

  const refreshed = await refreshSpotifyToken(tokens.refreshToken);

  const newAccessToken = refreshed.access_token;
  const newRefreshToken = refreshed.refresh_token ?? tokens.refreshToken; // Spotify may not return a new one

  const newExpiresAt = Date.now() + refreshed.expires_in * 1000;

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresAt: newExpiresAt,
  };
}

export async function deletePreset(id: string) {
  const { error } = await supabase.from("presets").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return true;
}

export async function getAllButtons(): Promise<RemoteButton[]> {
  const { data } = await supabase
    .from("buttons")
    .select("id, name, command, remote_id, remote:remotes(name)")
    .order("name");
  return (data ?? []) as unknown as RemoteButton[];
}

export async function getButtonsByIds(ids: string[]): Promise<RemoteButton[]> {
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from("buttons")
    .select("id, remote_id, name, command")
    .in("id", ids);

  if (error) {
    console.error("Failed to fetch buttons:", error);
    return [];
  }
  return data ?? [];
}

export async function getPresets(boardSerial: string): Promise<Preset[]> {
  const { data: presets } = await supabase
    .from("presets")
    .select("*")
    .eq("board_serial", boardSerial)
    .order("created_at", { ascending: false });

  if (!presets) return [];
  return await Promise.all(
    presets.map(async (preset) => {
      const buttons = await getButtonsByIds(preset.button_ids);

      return {
        ...preset,
        buttons,
      };
    }),
  );
}

export async function playPlaylist(accessToken: string, playlistUri: string) {
  if (!accessToken || !playlistUri) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/playlists/play`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
          playlist_uri: playlistUri,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error playing playlist:", text);
      throw new Error(`Failed to play playlist: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("playPlaylist error:", err);
  }
}

export async function playPreset(
  presetId: string,
  boardSerial: string,
  accessToken: string,
) {
  console.log("PLAYING PRESET", presetId, boardSerial, accessToken);
  if (!presetId || !boardSerial || !accessToken) return;

  try {
    console.log("making request");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/presets/play`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preset_id: presetId,
          board_serial: boardSerial,
          access_token: accessToken,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error playing preset:", text);
      throw new Error(`Failed to play preset: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("playPreset error:", err);
  }
}

export async function pressButton(
  boardSerial: string,
  device_header: string,
  command: string,
) {
  if (!boardSerial || !command) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_serial: boardSerial,
        device_header: device_header,
        command: command,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error triggering command:", text);
      throw new Error(`Failed to trigger command: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("pressButton error:", err);
  }
}

export async function getRemotes(boardSerial: string): Promise<Remote[]> {
  if (!boardSerial || boardSerial === "undefined") return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/remotes/${boardSerial}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error fetching remotes:", text);
      throw new Error(`Failed to fetch remotes: ${res.status}`);
    }

    const json = await res.json();
    return json.remotes || [];
  } catch (err) {
    console.error("getRemotes error:", err);
    return [];
  }
}

export async function getButtons(remoteId: string): Promise<RemoteButton[]> {
  if (!remoteId || remoteId === "undefined") return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/buttons/${remoteId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error fetching buttons:", text);
      throw new Error(`Failed to fetch buttons: ${res.status}`);
    }

    const json = await res.json();
    return json.buttons || [];
  } catch (err) {
    console.error("getButtons error:", err);
    return [];
  }
}

export async function exchangeSpotifyCode(code: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Failed to exchange Spotify code");
  }

  return res.json();
}

export async function refreshSpotifyToken(refreshToken: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

export async function getSpotifyUserId(accessToken: string): Promise<string> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    if (res.status == 401) {
    }
    throw new Error(`Failed to fetch Spotify user: ${res.status} ${error}`);
  }

  const data = await res.json();

  return data.id;
}

export async function getSpotifyPlaylists(
  token?: string,
): Promise<SpotifyPlaylist[] | null> {
  if (!token) return [];

  const userId = await getSpotifyUserId(token);

  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) return null; // signal expired token to caller
  if (!res.ok) return [];

  const data = await res.json();

  const publicPlaylists = data.items.filter(
    (p: SpotifyPlaylist) => p.public && p.owner.id === userId,
  );
  return publicPlaylists || [];
}

export async function getPlaylistCover(
  accessToken: string,
  playlistUri: string
) {
  const playlistId = playlistUri.split(":").pop();
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch playlist");
  }

  const data = await res.json();

  return {
    name: data.name,
    image: data.images?.[0]?.url ?? null,
  };
}