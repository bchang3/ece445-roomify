import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  const scope = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    state, // add this
  });

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}