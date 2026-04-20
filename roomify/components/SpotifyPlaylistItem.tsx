"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "@heroicons/react/16/solid";

type Props = {
  playlist: any;
  token: string;
};

export default function SpotifyPlaylistItem({ playlist, token }: Props) {
  const [open, setOpen] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [trackCount, setTrackCount] = useState<number>(playlist.items?.total ?? 0);
  const [loading, setLoading] = useState(false);

  const image = playlist.images?.[0]?.url;

  // ✅ correct count (authoritative endpoint)
  async function fetchPlaylistMeta() {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setTrackCount(data.tracks?.total ?? 0);
    } catch (err) {
      console.error(err);
    }
  }

  // ✅ FULL pagination support
  async function fetchTracks() {
    setLoading(true);

    try {
      let url = `https://api.spotify.com/v1/playlists/${playlist.id}/items`;
      let all: any[] = [];

      while (url) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("playlist data", data)
        all = [...all, ...(data.items || [])];
        url = data.next;
      }

      setTracks(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggle() {
    console.log("here");
    if (!open) {
      setOpen(true);

      if (!trackCount) fetchPlaylistMeta();
      if (tracks.length === 0) fetchTracks();
    } else {
      setOpen(false);
    }
  }

  function play(e: React.MouseEvent) {
    window.alert("Add code to play playlist", e);
  }

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-sm transition-all duration-300 cursor-pointer border border-transparent hover:border-red-100">
      <div className="flex items-center justify-between">
        {/* Image */}
        <div className="relative w-12 h-12">
          {image && (
            <Image
              src={image}
              alt="Playlist Image"
              fill
              sizes="48px"
              className="rounded-2xl object-cover"
            />
          )}

          <div className="absolute inset-0 rounded-2xl bg-black opacity-0 hover:opacity-50 flex items-center justify-center transition">
            <button onClick={play}>
              <PlayIcon className="w-4 h-4 text-white"/>
            </button>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 ml-3">
          <div className="font-semibold text-sm truncate">
            {playlist.name}
          </div>
          <div className="text-xs text-gray-500">
            {trackCount} tracks
          </div>
        </div>

        <button className="text-gray-400 text-sm cursor-pointer" onClick={toggle}>
          {open ? "▲" : "▼"}
        </button>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="mt-3 pl-2 border-t border-gray-400 pt-2 max-h-56 overflow-y-auto">
          {loading && (
            <div className="text-sm text-gray-400">Loading tracks...</div>
          )}

          {!loading &&
            tracks.map((t, i) => (
              <div key={i} className="text-sm py-1 truncate">
                {i + 1}.{" "}
                {t.track?.name ?? (
                  <span className="text-gray-400">[Unavailable]</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}