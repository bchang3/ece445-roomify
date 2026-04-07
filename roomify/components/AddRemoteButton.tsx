"use client"

import { PlusIcon } from "@heroicons/react/24/outline";

const AddRemoteButton = () => {
  return (
    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" onClick={() => {window.alert("Add remote button pressed")}}>
      <PlusIcon className="w-6 h-6 text-[#B22222]" />
    </button>
  )
}

export default AddRemoteButton