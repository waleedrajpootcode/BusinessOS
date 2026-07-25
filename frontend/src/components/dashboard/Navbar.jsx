function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
          Profile
        </button>
      </div>
    </header>
  );
}

export default Navbar;