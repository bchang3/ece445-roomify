"use client";
import { pressButton } from "@/lib/server";
import { RemoteButton } from "@/lib/types";
import { useState } from "react";

export default function ButtonGrid({ buttons }: { buttons: RemoteButton[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePress(btn: RemoteButton) {
    setLoading(btn.id);
    try {
      //FIXME
      pressButton("917a595fba5dba86", btn.id);
    } catch (err) {
      console.error(err);
    } finally {
      // Simulate physical feedback delay
      setTimeout(() => setLoading(null), 300);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          disabled={!!loading}
          onClick={() => handlePress(btn)}
          className={`group flex flex-col items-start p-5 border border-gray-200 rounded-xl transition-all text-left
            ${
              loading === btn.id
                ? "bg-gray-100 border-gray-300 scale-[0.98]"
                : "hover:border-[#D32F2F] bg-white hover:shadow-[0_4px_12px_rgba(211,47,47,0.08)] active:bg-gray-100"
            }`}
        >
          <span className="text-gray-900 font-semibold text-base mb-1 group-hover:text-[#D32F2F] transition-colors">
            {btn.name}
          </span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight">
            {btn.command || "0xB24D7887"}
          </span>
        </button>
      ))}
    </div>
  );
}
