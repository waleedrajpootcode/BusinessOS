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

  return (
    <aside
      className={`
fixed
left-0
top-0
h-screen
w-64
bg-slate-900
text-white
flex
flex-col
z-50
transform
transition-transform
duration-300
${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
md:translate-x-0
`}
    >

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">

        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden mb-4 text-gray-300"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">

          {business?.logo ? (

            <img
              src={business.logo}
              alt="Business Logo"
              className="w-12 h-12 rounded-lg object-cover bg-white p-1"
            />

          ) : (

            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-xl font-bold">
              B
            </div>

          )}

          <div>

            <h1 className="text-lg font-bold">

              {business?.business_name || "BusinessOS"}

            </h1>

            <p className="text-xs text-slate-400">

              Business Management

            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">

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
            <Link to="/inventory">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Boxes size={20} />
                Inventory
              </button>
            </Link>
          </li>
          <li>

            <Link to="/expenses">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Receipt size={20} />
                Expenses
              </button>
            </Link>
          </li>

          {role === "admin" && (
            <li>
              <Link to="/reports">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  <BarChart3 size={20} />
                  Reports
                </button>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link to="/users">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  <UserCog size={20} />
                  Users
                </button>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link to="/employees">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  <BadgePlus size={20} />
                  Employees
                </button>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li>
              <Link to="/settings">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                  <Settings size={20} />
                  Settings
                </button>
              </Link>
            </li>

          )}

          <li>
            <Link to="/business-settings">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-slate-800 transition">
                <Building2 size={20} />
                Business Settings
              </button>
            </Link>
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