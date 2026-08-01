import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  Factory,
} from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          BusinessOS
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Business Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        <ul className="space-y-2">

          <li>
            <Link to="/dashboard">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                <LayoutDashboard size={20} />
                Dashboard
              </button>
            </Link>
          </li>

          <li>
            <Link to="/products">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Package size={20} />
                Products
              </button>
            </Link>
          </li>

          <li>
            <Link to="/customers">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Users size={20} />
                Customers
              </button>
            </Link>
          </li>

          <li>
            <Link to="/sales">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">

                <ShoppingCart size={20} />
                Sales

              </button>
            </Link>
          </li>

          <li>
            <Link to="/suppliers">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">

                <Factory size={20} />
                Suppliers

              </button>
            </Link>
          </li>

          <li>
            <Link to="/purchases">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Truck size={20} />
                Purchases
              </button>
            </Link>
          </li>

          <li>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
              <Boxes size={20} />
              Inventory
            </button>
          </li>

          <li>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
              <BarChart3 size={20} />
              Reports
            </button>
          </li>

          <li>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
              <Settings size={20} />
              Settings
            </button>
          </li>

        </ul>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">

        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;