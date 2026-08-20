import { Menu } from "lucide-react";
import GlobalSearch from "../search/GlobalSearch";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="min-h-16 shrink-0 bg-white border-b border-gray-200 flex flex-wrap items-center gap-2 px-3 sm:px-6 py-2">

      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden min-h-11 min-w-11 p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
          Dashboard
        </h1>

      </div>

      {/* Search */}
      <div className="flex-1 min-w-[180px] flex justify-end md:justify-center px-1 sm:px-2 md:px-8">

        <div className="w-full max-w-xl">
          <GlobalSearch />
        </div>

      </div>

      {/* Right */}
      <button
        type="button"
        className="min-h-11 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shrink-0"
      >
        Profile
      </button>

    </header>
  );
}

export default Navbar;