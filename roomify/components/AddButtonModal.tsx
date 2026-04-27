"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { RemoteCapture } from "@/lib/types";
import { Radio } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  boardSerial: string;
  remote_id: string;
};

export default function AddButtonModal({
  open,
  setOpen,
  boardSerial,
  remote_id,
}: Props) {
  const [name, setName] = useState("");
  const [listening, setListening] = useState(false);
  const [captured, setCaptured] = useState<{
    device_header: string;
    command: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // ---------- HELPER: update polling ----------
  async function setPollingState(state: boolean) {
    try {
      await supabase
        .from("boards")
        .update({ polling: state })
        .eq("serial_number", boardSerial);
    } catch (err) {
      console.error("Failed to update polling state:", err);
    }
  }

  // ---------- REALTIME LISTENER ----------
  useEffect(() => {
    if (!listening) return;

    const channel = supabase
      .channel("ir_captures")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ir_captures",
          filter: `board_serial=eq.${boardSerial}`,
        },
        (payload) => {
          const row = payload.new as RemoteCapture;

          setCaptured({
            device_header: row.device_header,
            command: row.command,
          });

          setListening(false);
          setPollingState(false); // stop polling once we got a capture
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listening, boardSerial]);

  // ---------- ACTIONS ----------
  async function startListening() {
    setCaptured(null);
    setListening(true);
    await setPollingState(true);
  }

  async function resync() {
    setCaptured(null);
    setListening(true);
    await setPollingState(true);
  }

  async function closeModal() {
    setOpen(false);
    setListening(false);
    await setPollingState(false);
  }

  async function save() {
    if (!name || !captured) return;

    setSaving(true);

    try {
      const { data, error } = await supabase.from("buttons").insert({
        name,
        command: captured.command,
        remote_id: remote_id,
        device_header: captured.device_header,
      });

      if (error) {
        console.error("Insert failed:", error.message);
        throw error; // or handle UI state here
      }

      await setPollingState(false);

      setOpen(false);
      setName("");
      setCaptured(null);
      setListening(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-sm border border-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Add Button</h2>
          <button onClick={closeModal}>×</button>
        </div>

        {/* NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Button name"
          className="w-full border border-gray-100 rounded-md px-3 py-2 mb-4 text-sm"
        />

        {/* CAPTURE AREA */}
        <div className="flex flex-row items-center justify-center border border-gray-100 rounded-md p-4 mb-4 text-center">
          {!captured && !listening && (
            <button
              onClick={startListening}
              className="flex flex-row gap-2 bg-[#B22222] text-white px-4 py-2 rounded-md text-sm"
            >
              <Radio className="w-4 h-4" />
              Start Listening
            </button>
          )}

          {listening && (
            <div className="text-gray-600 text-base animate-pulse">
              Waiting for IR signal...
            </div>
          )}

          {captured && (
            <div className="space-y-2">
              <div className="text-sm font-mono text-gray-700">
                {captured.device_header} • {captured.command}
              </div>

              <button
                onClick={resync}
                className="text-xs text-red-500 hover:underline"
              >
                Resync
              </button>
            </div>
          )}
        </div>

        {/* SAVE */}
        <button
          onClick={save}
          disabled={!name || !captured || saving}
          className="w-full bg-[#B22222] text-white py-2 rounded-md disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
