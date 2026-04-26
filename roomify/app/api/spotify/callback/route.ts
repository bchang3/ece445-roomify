import { NextResponse } from "next/server";
import { exchangeSpotifyCode } from "@/lib/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const redirect_uri = process.env.REDIRECT_URI;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }


  try {
    //FIXME
    const board_serial = "917a595fba5dba86";

    const tokenData = await exchangeSpotifyCode(code);

    const expiresAt = Date.now() + tokenData.expires_in * 1000;

    const { error } = await supabase
      .from("spotify_connections")
      .upsert({
        board_serial,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
      });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to store tokens" },
        { status: 500 }
      );
    }

    console.log("Spotify token stored in DB");

    return NextResponse.redirect(redirect_uri ?? "");
  } catch (err) {
    console.error("Spotify callback error:", err);

    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 }
    );
  }
}