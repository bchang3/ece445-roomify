import { getButtons, getRemotes } from "@/lib/server";
import ButtonGrid from "@/components/ButtonGrid";
import Link from "next/link";

export default async function RemotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //FIXME
  const allRemotes = await getRemotes("917a595fba5dba86");
  const remote = allRemotes.find((r) => r.id === id);
  const buttons = await getButtons(id);

  if (!remote)
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        Remote not found.
      </div>
    );

  return (
    <div className="min-h-screen mx-auto max-w-lg w-full p-4 bg-[#F8F8F8] font-sans antialiased">
      {/* Outer Card Container */}
      <div className="max-w-4xl mx-auto border border-gray-100 overflow-hidden">
        {/* Content Area */}
        <div className="p-4 space-y-4">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Remotes
          </Link>

          {/* Current Device Header Card */}
          <div className="bg-white border border-gray-100 rounded-xl py-4 px-6 flex items-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-w-2xl">
            <div className="w-16 h-16 bg-[#D32F2F] rounded-3xl flex items-center justify-center shadow-lg shadow-red-100">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {remote.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <span>{remote.device_type}</span>
                <span>•</span>
                <span>{buttons.length} buttons</span>
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Buttons
              </h3>
              <p className="text-[10px] font-mono text-gray-300 italic">
                tap to send IR signal
              </p>
            </div>

            <ButtonGrid
              device_header={remote.device_header}
              buttons={buttons}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
