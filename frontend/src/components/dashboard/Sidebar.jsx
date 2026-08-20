import { useAuth } from "../../context/AuthContext";
import { useBusiness } from "../../context/BusinessContext";

import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  Boxes,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Factory,
  UserCog,
  BadgePlus,
  Building2,
} from "lucide-react";

import { Link } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const { role } = useAuth();
  const { business } = useBusiness();

  function handleNavigation() {
    setSidebarOpen(false);
  }

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        h-[100dvh]
        w-64
        max-w-[85vw]
        bg-slate-900
        text-white
        flex
        flex-col
        z-50
        transform
        transition-transform
        duration-300
        overflow-hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-slate-700 shrink-0">

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden mb-4 min-h-11 min-w-11 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          aria-label="Close navigation menu"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 min-w-0">

          {business?.logo ? (
            <img
              src={business.logo}
              alt="Business Logo"
              className="w-12 h-12 shrink-0 rounded-lg object-cover bg-white p-1"
            />
          ) : (
            <div className="w-12 h-12 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-xl font-bold">
              B
            </div>
          )}

          <div className="min-w-0">

            <h1 className="text-lg font-bold truncate">
              {business?.business_name || "BusinessOS"}
            </h1>

            <p className="text-xs text-slate-400 truncate">
              Business Management
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overflow-x-hidden">

        <ul className="space-y-2">

          <li>
            <Link
              to="/dashboard"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              <LayoutDashboard size={20} className="shrink-0" />
              <span className="truncate">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Package size={20} className="shrink-0" />
              <span className="truncate">Products</span>
            </Link>
          </li>

          <li>
            <Link
              to="/customers"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Users size={20} className="shrink-0" />
              <span className="truncate">Customers</span>
            </Link>
          </li>

          <li>
            <Link
              to="/sales"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <ShoppingCart size={20} className="shrink-0" />
              <span className="truncate">Sales</span>
            </Link>
          </li>

          <li>
            <Link
              to="/suppliers"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Factory size={20} className="shrink-0" />
              <span className="truncate">Suppliers</span>
            </Link>
          </li>

          <li>
            <Link
              to="/purchases"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Truck size={20} className="shrink-0" />
              <span className="truncate">Purchases</span>
            </Link>
          </li>

          <li>
            <Link
              to="/inventory"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Boxes size={20} className="shrink-0" />
              <span className="truncate">Inventory</span>
            </Link>
          </li>

          <li>
            <Link
              to="/expenses"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Receipt size={20} className="shrink-0" />
              <span className="truncate">Expenses</span>
            </Link>
          </li>

          {role === "admin" && (
            <li>
              <Link
                to="/reports"
                onClick={handleNavigation}
                className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <BarChart3 size={20} className="shrink-0" />
                <span className="truncate">Reports</span>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link
                to="/users"
                onClick={handleNavigation}
                className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <UserCog size={20} className="shrink-0" />
                <span className="truncate">Users</span>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link
                to="/employees"
                onClick={handleNavigation}
                className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <BadgePlus size={20} className="shrink-0" />
                <span className="truncate">Employees</span>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link
                to="/settings"
                onClick={handleNavigation}
                className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <Settings size={20} className="shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/business-settings"
              onClick={handleNavigation}
              className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
            >
              <Building2 size={20} className="shrink-0" />
              <span className="truncate">Business Settings</span>
            </Link>
          </li>

        </ul>

      </nav>

      {/* Logout */}
      <div className="p-3 sm:p-4 border-t border-slate-700 shrink-0">

        <button
          type="button"
          className="flex items-center gap-3 w-full min-h-11 px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={20} className="shrink-0" />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;