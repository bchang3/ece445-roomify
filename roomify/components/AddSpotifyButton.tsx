"use client";

import Image from "next/image";

export default function AddSpotifyButton() {
  const handleLogin = () => {
    // ✅ simplest + most reliable OAuth flow
    window.location.href = "/api/spotify/login";
  };

  return (
    <button
      className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#B22222]"
      onClick={handleLogin}
    >
      <Image src="/spotify.svg" alt="Spotify" width={24} height={24} />
    </button>
  );
}