"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createClient } from "@supabase/supabase-js";

type DeviceType = "lights" | "screen" | "aroma_diffuser";

export default function AddRemoteButton() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("lights");
  const [boardSerial, setBoardSerial] = useState("917a595fba5dba86"); //FIXME

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function save() {
    if (!name.trim() || !boardSerial) return;

    setSaving(true);

    try {
      await supabase.from("remotes").insert({
        name: name.trim(),
        device_type: deviceType,
        board_serial: boardSerial,
        device_header: "0x00", //FIXME
      });

      setOpen(false);

      // reset
      setName("");
      setDeviceType("lights");

      window.location.reload();
    } catch (err) {
      console.error("Failed to create button:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="w-6 h-6 text-[#B22222]" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#F8F8F8] border border-gray-100 w-full max-w-lg rounded-2xl p-5 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                Add Remote Button
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            </div>

            {/* NAME */}
            <label className="block mb-1 text-xs font-bold text-black uppercase tracking-wide">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LED Lights"
              className="w-full bg-white border border-gray-100 rounded-md px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-red-100"
            />


            {/* DEVICE TYPE */}
            <label className="block mb-1 text-xs font-bold text-black uppercase tracking-wide">
              Device Type
            </label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as DeviceType)}
              className="w-full bg-white border border-gray-100 rounded-md px-3 py-2 text-sm mb-3 outline-none"
            >
              <option value="lights">Lights</option>
              <option value="screen">Screen</option>
              <option value="aroma_diffuser">Aroma Diffuser</option>
            </select>

            {/* SAVE */}
            <button
              onClick={save}
              disabled={
                saving ||
                !name.trim() ||
                !boardSerial
              }
              className="w-full bg-[#B22222] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-red-700 disabled:opacity-40 transition"
            >
              {saving ? "Saving..." : "Create Button"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}