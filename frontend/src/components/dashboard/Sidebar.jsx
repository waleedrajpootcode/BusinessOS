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
  Sparkles,
  X,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { role } = useAuth();
  const { business } = useBusiness();
  const location = useLocation();

  function handleNavigation() {
    setSidebarOpen(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout Error:", error);
      return;
    }

    setSidebarOpen(false);
  }

  function getNavClass(path) {
    const isActive = location.pathname === path;

    return `
      group
      relative
      flex
      items-center
      gap-3
      w-full
      min-h-11
      px-4
      py-3
      rounded-xl
      transition-all
      duration-200
      ${isActive
        ? "bg-amber-400/10 text-amber-300 shadow-sm"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
      }
    `;
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
        bg-[#0b0d10]
        text-white
        flex
        flex-col
        z-50
        transform
        transition-transform
        duration-300
        overflow-hidden
        border-r
        border-white/10
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >

      {/* ================================
          BRAND HEADER
      ================================= */}

      <div className="p-4 sm:p-5 border-b border-white/10 shrink-0">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            {/* Business Logo */}

            {business?.logo ? (
              <img
                src={business.logo}
                alt="Business Logo"
                className="
                  w-11
                  h-11
                  shrink-0
                  rounded-xl
                  object-cover
                  bg-white
                  p-1
                  ring-1
                  ring-amber-400/30
                "
              />
            ) : (
              <div
                className="
                  w-11
                  h-11
                  shrink-0
                  rounded-xl
                  bg-gradient-to-br
                  from-amber-300
                  to-yellow-600
                  text-black
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-black
                  shadow-lg
                  shadow-amber-500/10
                "
              >
                B
              </div>
            )}

            {/* Brand Text */}

            <div className="min-w-0">

              <h1 className="text-base font-bold truncate text-white">
                {business?.business_name || "BusinessOS"}
              </h1>

              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                Powered by RRAW
              </p>

            </div>

          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="
              md:hidden
              shrink-0
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-lg
              text-slate-400
              hover:text-white
              hover:bg-white/5
              transition
            "
            aria-label="Close navigation menu"
          >
            <X size={19} />
          </button>

        </div>

      </div>


      {/* ================================
          NAVIGATION
      ================================= */}

      <nav
        className="
          flex-1
          min-h-0
          p-3
          sm:p-4
          overflow-y-auto
          overflow-x-hidden
        "
      >

        {/* Main Section */}

        <div className="px-3 mb-2">

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Main
          </p>

        </div>

        <ul className="space-y-1">

          {/* Dashboard */}

          <li>
            <Link
              to="/dashboard"
              onClick={handleNavigation}
              className={getNavClass("/dashboard")}
            >
              {location.pathname === "/dashboard" && (
                <span
                  className="
                    absolute
                    left-0
                    top-2
                    bottom-2
                    w-0.5
                    rounded-full
                    bg-amber-400
                  "
                />
              )}

              <LayoutDashboard
                size={19}
                className="shrink-0"
              />

              <span className="truncate font-medium">
                Dashboard
              </span>
            </Link>
          </li>

          {/* AI Business Advisor */}

          <li>
            <Link
              to="/ai-advisor"
              onClick={handleNavigation}
              className={getNavClass("/ai-advisor")}
            >
              {location.pathname === "/ai-advisor" && (
                <span
                  className="
                  absolute
                  left-0
                  top-2
                  bottom-2
                  w-0.5
                  rounded-full
                  bg-amber-400
                "
                />
              )}

              <Sparkles
                size={19}
                className="shrink-0"
              />

              <span className="truncate">
                AI Advisor
              </span>
            </Link>
          </li>


          {/* Products */}

          <li>
            <Link
              to="/products"
              onClick={handleNavigation}
              className={getNavClass("/products")}
            >
              {location.pathname === "/products" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Package size={19} className="shrink-0" />

              <span className="truncate">
                Products
              </span>
            </Link>
          </li>


          {/* Customers */}

          <li>
            <Link
              to="/customers"
              onClick={handleNavigation}
              className={getNavClass("/customers")}
            >
              {location.pathname === "/customers" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Users size={19} className="shrink-0" />

              <span className="truncate">
                Customers
              </span>
            </Link>
          </li>


          {/* Sales */}

          <li>
            <Link
              to="/sales"
              onClick={handleNavigation}
              className={getNavClass("/sales")}
            >
              {location.pathname === "/sales" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <ShoppingCart size={19} className="shrink-0" />

              <span className="truncate">
                Sales
              </span>
            </Link>
          </li>


          {/* Suppliers */}

          <li>
            <Link
              to="/suppliers"
              onClick={handleNavigation}
              className={getNavClass("/suppliers")}
            >
              {location.pathname === "/suppliers" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Factory size={19} className="shrink-0" />

              <span className="truncate">
                Suppliers
              </span>
            </Link>
          </li>


          {/* Purchases */}

          <li>
            <Link
              to="/purchases"
              onClick={handleNavigation}
              className={getNavClass("/purchases")}
            >
              {location.pathname === "/purchases" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Truck size={19} className="shrink-0" />

              <span className="truncate">
                Purchases
              </span>
            </Link>
          </li>


          {/* Inventory */}

          <li>
            <Link
              to="/inventory"
              onClick={handleNavigation}
              className={getNavClass("/inventory")}
            >
              {location.pathname === "/inventory" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Boxes size={19} className="shrink-0" />

              <span className="truncate">
                Inventory
              </span>
            </Link>
          </li>


          {/* Expenses */}

          <li>
            <Link
              to="/expenses"
              onClick={handleNavigation}
              className={getNavClass("/expenses")}
            >
              {location.pathname === "/expenses" && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-amber-400" />
              )}

              <Receipt size={19} className="shrink-0" />

              <span className="truncate">
                Expenses
              </span>
            </Link>
          </li>

        </ul>


        {/* ================================
            MANAGEMENT
        ================================= */}

        {role === "admin" && (
          <>

            <div className="px-3 mt-7 mb-2">

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                Management
              </p>

            </div>

            <ul className="space-y-1">

              {/* Reports */}

              <li>
                <Link
                  to="/reports"
                  onClick={handleNavigation}
                  className={getNavClass("/reports")}
                >
                  {location.pathname === "/reports" && (
                    <span className="absolute left-0 top-2 bottom-0 w-0.5 rounded-full bg-amber-400" />
                  )}

                  <BarChart3
                    size={19}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    Reports
                  </span>
                </Link>
              </li>


              {/* Users */}

              <li>
                <Link
                  to="/users"
                  onClick={handleNavigation}
                  className={getNavClass("/users")}
                >
                  {location.pathname === "/users" && (
                    <span className="absolute left-0 top-2 bottom-0 w-0.5 rounded-full bg-amber-400" />
                  )}

                  <UserCog
                    size={19}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    Users
                  </span>
                </Link>
              </li>


              {/* Employees */}

              <li>
                <Link
                  to="/employees"
                  onClick={handleNavigation}
                  className={getNavClass("/employees")}
                >
                  {location.pathname === "/employees" && (
                    <span className="absolute left-0 top-2 bottom-0 w-0.5 rounded-full bg-amber-400" />
                  )}

                  <BadgePlus
                    size={19}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    Employees
                  </span>
                </Link>
              </li>


            </ul>

          </>
        )}


        {/* ================================
            BUSINESS
        ================================= */}

        <div className="px-3 mt-7 mb-2">

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-slate-500
            "
          >
            Business
          </p>

        </div>

        <ul className="space-y-1">

          <li>
            <Link
              to="/business-settings"
              onClick={handleNavigation}
              className={getNavClass("/business-settings")}
            >
              {location.pathname === "/business-settings" && (
                <span className="absolute left-0 top-2 bottom-0 w-0.5 rounded-full bg-amber-400" />
              )}

              <Building2
                size={19}
                className="shrink-0"
              />

              <span className="truncate">
                Business Settings
              </span>
            </Link>
          </li>

        </ul>

      </nav>


      {/* ================================
          FOOTER / LOGOUT
      ================================= */}

      <div
        className="
          p-3
          sm:p-4
          border-t
          border-white/10
          shrink-0
        "
      >

        <button
          type="button"
          onClick={handleLogout}
          className=" 
    flex 
    items-center 
    gap-3 
    w-full 
    min-h-11 
    px-4 
    py-3 
    rounded-xl 
    text-slate-300 
    hover:bg-red-500/10 
    hover:text-red-400 
    transition-all 
    duration-200 
  "
        >
          <LogOut
            size={19}
            className="shrink-0"
          />

          <span className="font-medium">
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;