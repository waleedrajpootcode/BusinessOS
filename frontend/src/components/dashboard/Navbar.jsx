import { Menu } from "lucide-react";
import GlobalSearch from "../search/GlobalSearch";

function Navbar({ setSidebarOpen }) {

  return (

    <header className="min-h-16 bg-white border-b border-gray-200 flex flex-wrap items-center gap-2 px-3 sm:px-6 py-2">

      {/* Left */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold text-gray-800">
          Dashboard
        </h1>

      </div>

      {/* Search */}
      <div className="flex flex-1 justify-end md:justify-center px-2 md:px-8">
        <GlobalSearch />
      </div>

      {/* Right */}
      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">

        Profile

      </button>

    </header>

  );

}

export default Navbar;