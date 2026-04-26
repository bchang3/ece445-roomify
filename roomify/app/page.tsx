import { cookies } from "next/headers";
import { getRemotes, getSpotifyPlaylists } from "@/lib/server";
import RemoteList from "@/components/RemoteList";
import AddRemoteButton from "@/components/AddRemoteButton";
import SpotifyPlaylistItem from "@/components/SpotifyPlaylistItem";
import ConnectSpotify from "@/components/ConnectSpotify";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_token")?.value;

  const [playlistsResult, remotes] = await Promise.all([
    getSpotifyPlaylists(token),
    getRemotes("917a595fba5dba86"),
  ]);

  const isLoggedIn = !!token;
  const isTokenExpired = playlistsResult === null;
  const playlists = playlistsResult ?? [];

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between py-2 px-2 border-b border-gray-100 relative">
        <div className="w-6" />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-[#B22222] font-bold tracking-[0.2em] text-lg uppercase">
          Roomify
        </h1>

        <div className="flex gap-2">
          <AddRemoteButton />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6 flex-1">
        {/* REMOTES */}
        <div className="p-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your Devices</h2>
          <RemoteList remotes={remotes} />
        </div>

        {/* SPOTIFY */}
        <div className="p-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Your Spotify Playlists
          </h2>

          {!isLoggedIn && <ConnectSpotify />}

          {isLoggedIn && isTokenExpired && (
            <div className="mt-2 p-3 bg-white border border-red-200 rounded-md text-sm text-red-500">
              Spotify session expired. Reconnect.
            </div>
          )}

          {isLoggedIn && !isTokenExpired && (
            <div className="max-h-105 grid grid-cols-3 gap-2 overflow-y-auto space-y-3 pr-1">
              {playlists.map((p: any) => (
                <SpotifyPlaylistItem key={p.id} playlist={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto flex py-4 border-t border-gray-100 mx-auto gap-8">
        <div className="flex flex-col items-center text-red-800">
          <div className="bg-red-800 p-1 rounded-md text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5v11c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z" />
            </svg>
          </div>
          <span className="text-[10px] mt-1 font-bold">Remotes</span>
        </div>

        <div className="flex flex-col items-center text-red-800">
          <div className="bg-red-800 p-1 rounded-md text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5v11c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z" />
            </svg>
          </div>
          <span className="text-[10px] mt-1 font-bold">Presets</span>
        </div>
      </div>
    </div>
  );
}
