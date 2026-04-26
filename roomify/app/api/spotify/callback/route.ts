import { NextResponse } from "next/server";
import { exchangeSpotifyCode } from "@/lib/server";

export async function GET(req: Request) {
  const redirect_uri = process.env.REDIRECT_URI;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const tokenData = await exchangeSpotifyCode(code);

    const expiresAt = Date.now() + tokenData.expires_in * 1000;

    const res = NextResponse.redirect(redirect_uri ?? "");

    res.cookies.set("spotify_token", tokenData.access_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    res.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    res.cookies.set("spotify_expires_at", expiresAt.toString(), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    console.log("Spotify token stored successfully");

    return res;
  } catch (err) {
    console.error("Spotify callback error:", err);

    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 },
    );
  }
}
