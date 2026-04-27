"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { PlusIcon } from "@heroicons/react/24/outline";
import { RemoteButton, SpotifyPlaylist } from "@/lib/types";
import AddPresetModal from "./AddPresetModal";

type Props = {
  buttons: RemoteButton[];
  playlists: SpotifyPlaylist[];
  token: string | null;
};

export default function AddPresetButton({ buttons, playlists, token }: Props) {
  const [open, setOpen] = useState(false);

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
      <AddPresetModal
        buttons={buttons}
        playlists={playlists}
        token={token}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
