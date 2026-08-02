import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
           fixed
           inset-0
           bg-black/50
           z-40
           md:hidden
    "
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">

        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">

          {children}

        </main>

      </div>

    </div>
  );
}

export default Layout;