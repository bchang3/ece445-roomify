import { getAllButtons, getPresets, getSpotifyPlaylists } from "@/lib/server";
import PresetsList from "@/components/PresetsList";
import AddPresetButton from "@/components/AddPresetButton";

export default async function PresetsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/spotify/token?board_serial=917a595fba5dba86`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  const token = data.access_token;

  const [playlists, buttons, presets] = await Promise.all([
    getSpotifyPlaylists(token).then((r) => r ?? []),
    getAllButtons(),
    getPresets("917a595fba5dba86"),
  ]);
  console.log(playlists);

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between py-2 px-2 border-b border-gray-100 relative">
        <div className="w-6" />

        <h1 className="absolute left-1/2 -translate-x-1/2 text-[#B22222] font-bold tracking-[0.2em] text-lg uppercase">
          Roomify
        </h1>

        <AddPresetButton
          buttons={buttons}
          playlists={playlists}
          token={token ?? null}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6 flex-1">
        <div className="p-2">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Presets</h2>
          <PresetsList presets={presets} playlists={playlists} buttons={buttons} accessToken={token} />
        </div>
      </div>
    </div>
  );
}
