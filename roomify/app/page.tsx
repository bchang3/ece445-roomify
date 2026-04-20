import { cookies } from "next/headers";
import { getRemotes, getSpotifyPlaylists, refreshSpotifyToken } from "@/lib/server";
import RemoteList from "@/components/RemoteList";
import AddRemoteButton from "@/components/AddRemoteButton";
import AddSpotifyButton from "@/components/AddSpotifyButton";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  console.log("[Spotify Auth] token exists:", !!token);

  const [playlistsResult, remotes] = await Promise.all([
    getSpotifyPlaylists(token),
    getRemotes("917a595fba5dba86"),
  ]);

  // null means token expired — attempt refresh server-side isn't possible here
  // since we can't set cookies in a Server Component; signal it to the UI instead
  const isLoggedIn = !!token;
  const isTokenExpired = playlistsResult === null;
  const playlists = playlistsResult ?? [];

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-2 border-b border-gray-100 relative">
          <div className="w-6" />

          <h1 className="absolute left-1/2 -translate-x-1/2 text-[#B22222] font-bold tracking-[0.2em] text-lg uppercase">
            Roomify
          </h1>

          <div className="flex gap-2">
            <AddSpotifyButton />
            <AddRemoteButton />
          </div>
        </div>

        {/* Remotes */}
        <div className="p-2 mt-2">
          <h2 className="text-lg font-bold text-gray-900">Your Devices</h2>
          <RemoteList remotes={remotes} />
        </div>

        {/* Spotify Section */}
        <div className="mt-6 p-2">
          <h2 className="text-lg font-bold text-gray-900">
            Your Spotify Playlists
          </h2>

          {/* Not logged in */}
          {!isLoggedIn && (
            <div className="mt-2 p-3 bg-white border rounded-md text-sm text-gray-500">
              You are not connected to Spotify yet. Click the Spotify icon to
              log in.
            </div>
          )}

          {/* Token expired */}
          {isLoggedIn && isTokenExpired && (
            <div className="mt-2 p-3 bg-white border border-red-200 rounded-md text-sm text-red-500">
              Your Spotify session has expired. Please click the Spotify icon to
              reconnect.
            </div>
          )}

          {/* Logged in but no playlists */}
          {isLoggedIn && !isTokenExpired && playlists.length === 0 && (
            <div className="mt-2 p-3 bg-white border rounded-md text-sm text-gray-500">
              No playlists found (or still loading from Spotify).
            </div>
          )}

          {/* Playlists */}
          {isLoggedIn && !isTokenExpired && playlists.length > 0 && (
            <div className="mt-3 space-y-2">
              {playlists.map((p: any) => (
                <div
                  key={p.id}
                  className="p-2 bg-white border rounded-md flex justify-between items-center"
                >
                  <span className="font-medium truncate">{p.name}</span>
                  <span className="text-xs text-gray-500">
                    {p.tracks?.total ?? 0} tracks
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-around py-4 border-t border-gray-100">
          <div className="flex flex-col items-center text-red-800">
            <div className="bg-red-800 p-1 rounded-md text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 5v11c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z" />
              </svg>
            </div>
            <span className="text-[10px] mt-1 font-bold">Remotes</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-[10px] mt-1">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}