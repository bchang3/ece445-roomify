import { Remote, RemoteButton } from "./types";

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
    throw new Error(`Failed to fetch Spotify user: ${res.status} ${error}`);
  }

  const data = await res.json();

  return data.id;
}

export async function getSpotifyPlaylists(token?: string) {
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
    (p: any) => p.public && p.owner.id === userId,
  );
  return publicPlaylists || [];
}
