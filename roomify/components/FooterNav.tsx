"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isPresets = pathname.startsWith("/presets");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 ">
      <div className="flex max-w-lg mx-auto items-center justify-around py-2 bg-white border-t border-gray-100">
        {/* HOME */}
        <Link
          href="/"
          className="relative flex flex-col items-center justify-center w-full py-2"
        >
          <Home
            className={`w-6 h-6 transition-colors ${
              isHome ? "text-[#B22222]" : "text-gray-400"
            }`}
            fill={isHome ? "#B22222" : "none"}
          />

          <span
            className={`text-xs mt-1 transition-colors ${
              isHome ? "text-[#B22222]" : "text-gray-400"
            }`}
          >
            Home
          </span>

          {/* active indicator */}
          {isHome && (
            <div className="absolute bottom-0 w-10 h-0.5 bg-[#B22222] rounded-full" />
          )}
        </Link>

        {/* PRESETS */}
        <Link
          href="/presets"
          className="relative flex flex-col items-center justify-center w-full py-2"
        >
          <LayoutGrid
            className={`w-6 h-6 transition-colors ${
              isPresets ? "text-[#B22222]" : "text-gray-400"
            }`}
            fill={isPresets ? "#B22222" : "none"}
          />

          <span
            className={`text-xs mt-1 transition-colors ${
              isPresets ? "text-[#B22222]" : "text-gray-400"
            }`}
          >
            Presets
          </span>

          {/* active indicator */}
          {isPresets && (
            <div className="absolute bottom-0 w-10 h-0.5 bg-[#B22222] rounded-full" />
          )}
        </Link>
      </div>
    </div>
  );
}