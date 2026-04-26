import { Music2 } from "lucide-react";
import SpotifyConnectButton from "./SpotifyConnectButton";

export default function ConnectSpotify() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-400 bg-white p-6 text-center press-scale">
      <div className="mx-auto h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
        <Music2 className="h-6 w-6 text-[#B22222] " />
      </div>
      <div className="flex justify-center mt-4">
        <SpotifyConnectButton />
      </div>
    </div>
  );
}
