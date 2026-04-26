"use client";

import Image from "next/image";
import { PlayIcon } from "@heroicons/react/16/solid";

type Props = {
  playlist: any;
};

export default function SpotifyPlaylistItem({ playlist }: Props) {
  const image = playlist.images?.[0]?.url;

  function play(e: React.MouseEvent) {
    console.log(e);
  }

  return (
    <div className="px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:bg-gray-200/50">
      <div className="flex flex-col items-center justify-between">
        {/* Image */}
        <div className="relative w-32 h-32">
          {image && (
            <Image
              src={image}
              alt="Playlist Image"
              fill
              sizes="128px"
              className="rounded-xl object-cover"
            />
          )}

          <div className="absolute inset-0 rounded-2xl bg-black opacity-0 hover:opacity-50 flex items-center justify-center transition">
            <button onClick={play}>
              <PlayIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Text */}
        <div className="font-medium text-left mt-1 text-sm truncate self-start">
          {playlist.name}
        </div>
      </div>
    </div>
  );
}
