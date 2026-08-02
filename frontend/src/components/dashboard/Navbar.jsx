import { Menu } from "lucide-react";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

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


      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
        Profile
      </button>


    </header>
  );
}

export default Navbar;