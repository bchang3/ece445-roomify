"use client";
import { useState } from "react";
import AddButtonModal from "./AddButtonModal";
import { PlusIcon } from "lucide-react";

interface AddButtonProps {
  board_serial: string;
  remote_id: string;
}
export default function AddButton({ board_serial, remote_id }: AddButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <PlusIcon className="w-4 h-4 text-[#B22222]" />
      </button>
      <AddButtonModal
        open={open}
        setOpen={setOpen}
        boardSerial={board_serial}
        remote_id={remote_id}
      />
    </div>
  );
}
