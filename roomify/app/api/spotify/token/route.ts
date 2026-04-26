import { NextResponse } from "next/server";
import { getValidSpotifyToken } from "@/lib/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const board_serial = searchParams.get("board_serial");

  if (!board_serial) {
    return NextResponse.json(
      { error: "Missing board_serial" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("spotify_connections")
    .select("access_token, refresh_token, expires_at")
    .eq("board_serial", board_serial)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Missing Spotify tokens" },
      { status: 401 }
    );
  }

  try {
    const updated = await getValidSpotifyToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
    });

    const accessTokenChanged =
      updated.accessToken !== data.access_token;
    const refreshTokenChanged =
      updated.refreshToken !== data.refresh_token;
    const expiresChanged =
      updated.expiresAt !== data.expires_at;

    // persist updates if needed
    if (accessTokenChanged || refreshTokenChanged || expiresChanged) {
      const { error: updateError } = await supabase
        .from("spotify_connections")
        .update({
          access_token: updated.accessToken,
          refresh_token: updated.refreshToken,
          expires_at: updated.expiresAt,
        })
        .eq("board_serial", board_serial);

      if (updateError) {
        console.error("Failed to update tokens:", updateError);
      }
    }

    return NextResponse.json({
      access_token: updated.accessToken,
    });
  } catch (err) {
    console.error("Token refresh failed:", err);

    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}