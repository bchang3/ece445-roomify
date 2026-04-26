"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";

type Button = {
  id: string;
  name: string;
  command: string;
  remotes: { name: string } | null;
};

type Playlist = { id: string; name: string };

type Props = {
  buttons: Button[];
  playlists: Playlist[];
  boardSerial: string;
  token: string | null;
};

export default function AddPresetButton({
  buttons,
  playlists,
  boardSerial,
  token,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const filteredButtons = buttons.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.remotes?.name.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleButton(id: string) {
    setSelectedButtons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function save() {
    if (!name.trim()) return;

    setSaving(true);

    try {
      // 1. Insert into DB
      await supabase.from("presets").insert({
        name: name.trim(),
        board_serial: boardSerial,
        playlist_id: selectedPlaylist?.id ?? null,
        playlist_name: selectedPlaylist?.name ?? null,
        button_ids: selectedButtons,
      });

      // 2. Reset UI immediately
      setOpen(false);
      setName("");
      setSelectedButtons([]);
      setSelectedPlaylist(null);
      setSearch("");

      // 3. Ensure server refresh triggers AFTER state updates
      router.refresh();
    } catch (err) {
      console.error("Failed to save preset:", err);
    } finally {
      setSaving(false);
    }
  }

  const grouped = filteredButtons.reduce<Record<string, Button[]>>(
    (acc, btn) => {
      const group = btn.remotes?.name ?? "Unknown";
      if (!acc[group]) acc[group] = [];
      acc[group].push(btn);
      return acc;
    },
    {},
  );

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen(true)}
        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
      >
        <PlusIcon className="w-6 h-6 text-[#B22222]" />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-[#F8F8F8] border border-gray-100 w-full max-w-lg rounded-2xl p-5 max-h-[90vh] overflow-y-auto shadow-sm">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">New Preset</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            </div>

            {/* NAME */}
            <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Preset Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "Movie Night"'
              className="w-full bg-white border border-gray-100 rounded-md px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-red-100"
            />

            {/* SEARCH */}
            <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Buttons
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buttons..."
              className="w-full bg-white border border-gray-100 rounded-md px-3 py-2 text-sm mb-2 outline-none focus:ring-2 focus:ring-red-100"
            />

            {/* BUTTON LIST */}
            <div className="border border-gray-100 rounded-md overflow-hidden mb-4 max-h-52 overflow-y-auto bg-white">
              {Object.entries(grouped).map(([remote, btns]) => (
                <div key={remote}>
                  <div className="px-3 py-1 bg-[#F8F8F8] text-[11px] font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    {remote}
                  </div>

                  {btns.map((btn) => {
                    const selected = selectedButtons.includes(btn.id);

                    return (
                      <button
                        key={btn.id}
                        onClick={() => toggleButton(btn.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm border-b border-gray-100 last:border-0 transition ${
                          selected
                            ? "bg-red-50 text-[#B22222]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span>{btn.name}</span>
                        <span className="text-gray-400 text-xs">
                          {btn.command}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}

              {filteredButtons.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-400 text-center bg-white">
                  No buttons found
                </div>
              )}
            </div>

            {/* PLAYLIST */}
            <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Spotify Playlist (optional)
            </label>

            {!token ? (
              <div className="text-xs text-gray-400 border border-gray-100 rounded-md px-3 py-2 mb-4 bg-white">
                Connect Spotify on the home screen to attach a playlist.
              </div>
            ) : (
              <div className="border border-gray-100 rounded-md overflow-hidden mb-4 max-h-48 overflow-y-auto bg-white">
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 transition ${
                    !selectedPlaylist
                      ? "bg-red-50 text-[#B22222] font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  None
                </button>

                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() =>
                      setSelectedPlaylist({ id: pl.id, name: pl.name })
                    }
                    className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 last:border-0 transition ${
                      selectedPlaylist?.id === pl.id
                        ? "bg-red-50 text-[#B22222] font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pl.name}
                  </button>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            {selectedButtons.length > 0 && (
              <div className="mb-4 text-xs text-gray-500">
                {selectedButtons.length} button
                {selectedButtons.length > 1 ? "s" : ""} selected
                {selectedPlaylist && ` · ${selectedPlaylist.name}`}
              </div>
            )}

            {/* SAVE */}
            <button
              onClick={save}
              disabled={saving || !name.trim()}
              className="w-full bg-[#B22222] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-40 transition"
            >
              {saving ? "Saving..." : "Save Preset"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
