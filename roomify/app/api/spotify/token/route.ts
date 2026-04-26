import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getValidSpotifyToken } from "@/lib/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("spotify_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;
  const expiresAt = Number(cookieStore.get("spotify_expires_at")?.value);

  if (!accessToken || !refreshToken || !expiresAt) {
    return NextResponse.json(
      { error: "Missing Spotify tokens" },
      { status: 401 },
    );
  }

  try {
    const updated = await getValidSpotifyToken({
      accessToken,
      refreshToken,
      expiresAt,
    });

    const res = NextResponse.json({
      access_token: updated.accessToken,
    });

    if (
      updated.accessToken !== accessToken ||
      updated.refreshToken !== refreshToken ||
      updated.expiresAt !== expiresAt
    ) {
      res.cookies.set("spotify_token", updated.accessToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });

      res.cookies.set("spotify_refresh_token", updated.refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });

      res.cookies.set("spotify_expires_at", updated.expiresAt.toString(), {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
    }

    return res;
  } catch (err) {
    console.error("Token refresh failed:", err);

    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
  }
}
