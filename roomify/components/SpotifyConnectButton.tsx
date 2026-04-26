import Image from "next/image";
export default function SpotifyConnectButton() {
  return (
    <a
      className="flex items-center gap-2 rounded-lg bg-[#B22222] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#9c1e1e]"
      href="/api/spotify/login"
    >
      <Image src="/spotify.svg" alt="Spotify" width={24} height={24} />
      Connect your Spotify
    </a>
  );
}
