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

    const res = NextResponse.redirect(redirect_uri ?? "");

    // 🍪 STORE TOKEN HERE
    res.cookies.set("spotify_token", tokenData.access_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false, // add this
    });

    res.cookies.set("spotify_token", tokenData.access_token, {
      httpOnly: true, path: "/", sameSite: "lax", secure: false,
    });
    res.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
      httpOnly: true, path: "/", sameSite: "lax", secure: false,
    });

    console.log("Spotify token stored successfully");

    return res;
  } catch (err) {
    console.error("Spotify callback error:", err);

    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 }
    );
  }
}