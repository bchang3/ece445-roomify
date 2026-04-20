"use client";
import { useRouter } from "next/navigation";
import { Remote } from "@/lib/types";
import {
  TvIcon,
  LightBulbIcon,
  CpuChipIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Helper to get the correct icon based on device_type enum
const DeviceIcon = ({ type }: { type: string }) => {
  switch (type.toUpperCase()) {
    case "TV":
      return <TvIcon className="w-6 h-6" />;
    case "LIGHT":
      return <LightBulbIcon className="w-6 h-6" />;
    case "AC":
      return <CpuChipIcon className="w-6 h-6" />;
    default:
      return <CommandLineIcon className="w-6 h-6" />;
  }
};

export default function RemoteList({ remotes }: { remotes: Remote[] }) {
  const router = useRouter();

  if (remotes.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
        <p className="text-gray-400">No devices found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {remotes.map((remote) => (
        <Link
          key={remote.id}
          href={`/remote/${remote.id}`}
          className="group relative bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-red-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {/* Icon Circle */}
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#B22222] group-hover:bg-[#B22222] group-hover:text-white transition-colors">
              <DeviceIcon type={remote.device_type} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-left">{remote.name}</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                {remote.device_type} • {remote.board_serial}
              </p>
            </div>
          </div>

          {/* Minimal Arrow indicator */}
          <div className="text-gray-300 group-hover:text-[#B22222] transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
