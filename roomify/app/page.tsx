import { getRemotes } from "@/lib/data";
import RemoteList from "@/components/RemoteList";
import AddRemoteButton from "@/components/AddRemoteButton";

export default async function Home() {
  const remotes = await getRemotes();

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 z-10">
          <div className="w-6" />
          <h1 className="text-[#B22222] font-bold tracking-[0.2em] text-lg uppercase">Roomify</h1>
  
          <AddRemoteButton />
        </div>
        
        {/* Remotes */}
        <div className="p-2">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Devices</h2>
            <p className="text-gray-500 text-xs">Select a remote to begin controlling.</p>
          </div>
  
          <RemoteList remotes={remotes} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-around py-4 border-t border-gray-100">
        <div className="flex flex-col items-center text-red-800">
          <div className="bg-red-800 p-1 rounded-md text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v11c0 5.25 3.42 10.16 8 11.5 4.58-1.34 8-6.25 8-11.5V5l-8-3z"/></svg>
          </div>
          <span className="text-[10px] mt-1 font-bold">Remotes</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span className="text-[10px] mt-1">Profile</span>
        </div>
      </div>
    </div>
  );
}