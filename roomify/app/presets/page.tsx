import { cookies } from "next/headers";
import { getSpotifyPlaylists } from "@/lib/server";
import { supabase } from "@/lib/supabase";
import PresetsList from "@/components/PresetsList";
import AddPresetButton from "@/components/AddPresetButton";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const BOARD_SERIAL = "917a595fba5dba86";

async function getButtons() {

  const { data } = await supabase
    .from("buttons")
    .select("id, name, command, remote_id, remotes(name)")
    .order("name");
  return data ?? [];
}

async function getPresets() {

  const { data } = await supabase
    .from("presets")
    .select("*")
    .eq("board_serial", BOARD_SERIAL)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function PresetsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("spotify_token")?.value;

  const [playlists, buttons, presets] = await Promise.all([
    getSpotifyPlaylists(token).then((r) => r ?? []),
    getButtons(),
    getPresets(),
  ]);

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] flex flex-col gap-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between py-2 px-2 border-b border-gray-100 relative">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
          <div className="flex gap-2">
            <ArrowLeftIcon className="w-5 h-5" />
            <div>Back</div>
          </div>
        </Link>

        <div className="w-6" />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-[#B22222] font-bold tracking-[0.2em] text-lg uppercase">
          Roomify
        </h1>

        {/* <AddPresetButton
          buttons={buttons}
          playlists={playlists}
          boardSerial={BOARD_SERIAL}
          token={token ?? null}
        /> */}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6 flex-1">
        <div className="p-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Presets
          </h2>
          {/* //FIXME */}
          <PresetsList presets={presets} buttons={[]} />
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