"use client";

import { useEffect, useState } from "react";
import { Preset } from "@/lib/types";
import { deletePreset, playPreset, getPlaylistCover } from "@/lib/server";
import Image from "next/image";

type Props = { presets: Preset[]; accessToken: string };

type CoverMap = Record<string, string | null>;

export default function PresetsList({ presets: initial, accessToken }: Props) {
  const [presets, setPresets] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [covers, setCovers] = useState<CoverMap>({});

  async function handleDeletePreset(id: string) {
    setDeleting(id);
    await deletePreset(id);
    setPresets((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  }

  // Fetch playlist covers
  useEffect(() => {
    async function loadCovers() {
      const newCovers: CoverMap = {};

      await Promise.all(
        presets.map(async (preset) => {
          if (!preset.playlist_uri) return;

          try {
            const res = await getPlaylistCover(
              accessToken,
              preset.playlist_uri
            );
            newCovers[preset.id] = res.image;
          } catch {
            newCovers[preset.id] = null;
          }
        })
      );

      setCovers(newCovers);
    }

    loadCovers();
  }, [presets, accessToken]);

  if (presets.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
        <p className="text-gray-400">No presets yet. Tap + to create one.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {presets.map((preset) => (
        <div
          key={preset.id}
          onClick={() =>
            playPreset(preset.id, "917a595fba5dba86", accessToken)
          }
          className="group flex bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-red-100 overflow-hidden"
        >
          {/* LEFT: COVER IMAGE */}
          <div className="w-20 h-full bg-gray-100 flex-shrink-0">
            {covers[preset.id] ? (
              <Image
                src={covers[preset.id]!}
                alt="playlist cover"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          {/* MIDDLE: CONTENT */}
          <div className="flex-1 px-4 py-3">
            {/* HEADER */}
            <h3 className="font-semibold text-gray-900">
              {preset.name}
            </h3>

            {/* BUTTON TAGS */}
            {preset.buttons?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {preset.buttons.map((btn) => (
                  <span
                    key={btn.id}
                    className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {btn.name}
                    <span className="text-gray-400 ml-1">
                      ({btn.command})
                    </span>
                  </span>
                ))}
              </div>
            ) : null}

            {/* PLAYLIST LABEL */}
            {preset.playlist_name && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] bg-green-500 text-white px-2 py-1 rounded-full">
                  <Image
                    src="/spotify.svg"
                    alt="Spotify"
                    width={12}
                    height={12}
                  />
                  {preset.playlist_name}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: DELETE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePreset(preset.id);
            }}
            disabled={deleting === preset.id}
            className="px-3 text-gray-300 hover:text-red-400 transition text-xl self-start"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}