import { Menu, ChevronDown, UserCircle2 } from "lucide-react";
import GlobalSearch from "../search/GlobalSearch";
import { useBusiness } from "../../context/BusinessContext";

function Navbar({ setSidebarOpen }) {
  const { business } = useBusiness();

  return (
    <header
      className="
        min-h-16
        shrink-0
        bg-white
        border-b
        border-gray-200
        flex
        items-center
        gap-2
        px-3
        sm:px-5
        lg:px-6
        py-2
      "
    >

      {/* =================================
          LEFT — MOBILE MENU + PAGE AREA
      ================================== */}

      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            md:hidden
            min-h-11
            min-w-11
            p-2
            rounded-xl
            border
            border-gray-200
            bg-white
            hover:bg-gray-50
            flex
            items-center
            justify-center
            shrink-0
            transition
          "
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:block min-w-0">

          <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400 font-semibold">
            BusinessOS
          </p>

          <h1 className="text-base lg:text-lg font-bold text-gray-800 truncate">
            Dashboard
          </h1>

        </div>

      </div>


      {/* =================================
          GLOBAL SEARCH
      ================================== */}

      <div
        className="
          flex-1
          min-w-0
          flex
          justify-center
          px-1
          sm:px-3
          lg:px-8
        "
      >

        <div className="w-full max-w-xl">
          <GlobalSearch />
        </div>

      </div>


      {/* =================================
          RIGHT — BUSINESS / PROFILE
      ================================== */}

      <div className="flex items-center gap-2 shrink-0">

        {/* Business Name */}

        <div className="hidden lg:block text-right min-w-0 max-w-40">

          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            Workspace
          </p>

          <p className="text-sm font-semibold text-gray-800 truncate">
            {business?.business_name || "BusinessOS"}
          </p>

        </div>


        {/* Profile Button */}

        <button
          type="button"
          className="
            min-h-11
            px-3
            sm:px-3.5
            py-2
            rounded-xl
            bg-[#0b0d10]
            text-amber-300
            hover:bg-gray-900
            border
            border-gray-800
            transition
            flex
            items-center
            gap-2
            shrink-0
          "
        >

          <UserCircle2
            size={19}
            className="shrink-0"
          />

          <span className="hidden sm:inline text-sm font-semibold">
            Profile
          </span>

          <ChevronDown
            size={15}
            className="hidden sm:block text-gray-400"
          />

        </button>

      </div>

    </header>
  );
}

export default Navbar;