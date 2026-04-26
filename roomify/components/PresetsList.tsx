"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Preset = {
  id: string;
  name: string;
  playlist_id: string | null;
  playlist_name: string | null;
  button_ids: string[];
};

export type PresetButton = {
  id: string;
  name: string;
  command: string;
  remotes: { name: string } | null;
};

type Props = { presets: Preset[]; buttons: PresetButton[] };

export default function PresetsList({ presets: initial, buttons }: Props) {
  const [presets, setPresets] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  const buttonMap = Object.fromEntries(buttons.map((b) => [b.id, b]));

  async function deletePreset(id: string) {
    setDeleting(id);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.from("presets").delete().eq("id", id);
    setPresets((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  }

  if (presets.length === 0) {
    return (
      <div className="mt-2 p-4 bg-white border rounded-lg text-sm text-gray-400 text-center">
        No presets yet. Tap + to create one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <div key={preset.id} className="bg-white border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-sm text-gray-900">
                {preset.name}
              </div>
              {preset.playlist_name && (
                <div className="flex items-center gap-1 mt-1">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  <span className="text-xs text-green-600">
                    {preset.playlist_name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => deletePreset(preset.id)}
              disabled={deleting === preset.id}
              className="text-gray-300 hover:text-red-400 transition text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Buttons */}
          {preset.button_ids.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {preset.button_ids.map((bid) => {
                const btn = buttonMap[bid];
                return btn ? (
                  <span
                    key={bid}
                    className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {btn.name}
                    <span className="text-gray-400 ml-1">({btn.command})</span>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
