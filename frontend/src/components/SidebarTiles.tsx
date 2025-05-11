import { Gauge, CheckCircle2, Home } from "lucide-react";

export default function SidebarTiles() {
  return (
    <aside className="w-[300px] h-screen bg-white/70 backdrop-blur-md flex flex-col p-6 space-y-6 rounded-xl shadow-lg">
      {/* Address Section */}
      <div>
        <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 21s-6-5.686-6-10A6 6 0 1 1 18 11c0 4.314-6 10-6 10z"
              stroke="#4B5563"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="11" r="2.5" stroke="#4B5563" strokeWidth="2" />
          </svg>
          <span>Marktstraße 15</span>
        </div>
        <div className="text-gray-500 text-sm ml-6">79106 Freiburg</div>
      </div>

      {/* Main Tiles */}
      <div className="flex flex-col gap-3">
        <button className="flex items-center w-full px-4 py-3 rounded-lg bg-white shadow border border-green-200 text-green-600 font-semibold text-base focus:outline-none">
          <Gauge className="w-5 h-5 mr-3" />
          Energieprofil
        </button>
        <button className="flex items-center w-full px-4 py-3 rounded-lg bg-white shadow border text-gray-500 font-semibold text-base focus:outline-none">
          <CheckCircle2 className="w-5 h-5 mr-3" />
          Grün.Check
        </button>
        <button className="flex items-center w-full px-4 py-3 rounded-lg bg-white shadow border text-gray-500 font-semibold text-base focus:outline-none">
          <Home className="w-5 h-5 mr-3" />
          Potenziale
        </button>
      </div>
    </aside>
  );
}
