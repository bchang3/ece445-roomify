"use client";

import { useState } from "react";
import { Preset } from "@/lib/types";
import { deletePreset, playPreset } from "@/lib/server";
import Image from "next/image";

type Props = { presets: Preset[]; accessToken: string };

export default function PresetsList({ presets: initial, accessToken }: Props) {
  const [presets, setPresets] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDeletePreset(id: string) {
    setDeleting(id);
    await deletePreset(id);
    setPresets((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  }

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
          onClick={() => playPreset(preset.id, "917a595fba5dba86", accessToken)}
          className="group relative bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-red-100"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-left">
                {preset.name}
              </h3>
            </div>

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePreset(preset.id);
              }}
              disabled={deleting === preset.id}
              className="text-gray-300 hover:text-red-400 transition text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 font-semibold">
            {preset.buttons?.length ? (
              <div className="flex gap-2">
                {preset.buttons.map((btn) => (
                  <span
                    key={btn.id}
                    className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {btn.name}
                    <span className="text-gray-400 ml-1">({btn.command})</span>
                  </span>
                ))}
              </div>
            ) : null}
            {preset.playlist_name && (
              <div>
                <span className="flex flex-row gap-1 text-[11px] bg-green-500 text-white px-2 py-1 rounded-full">
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
        </div>
      ))}
    </div>
  );
}
