import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/dashboard/Layout";
import DashboardCards from "../components/dashboard/DashboardCards";
import LowStockCard from "../components/dashboard/cards/LowStockCard";
import RecentSalesCard from "../components/dashboard/RecentSalesCard";
import TopSellingCard from "../components/dashboard/cards/TopSellingCard";
import { getLowStockProducts } from "../services/dashboard";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import { getNotifications } from "../services/notifications";
import { useBusiness } from "../context/BusinessContext";

function Dashboard() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const { role } = useAuth();
  const { business } = useBusiness();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const products = await getLowStockProducts();

    setLowStockProducts(products);

    setNotifications(
      await getNotifications()
    );
  }

  return (
    <Layout>

      {/* =====================================================
          DASHBOARD HEADER
      ====================================================== */}

      <section className="mb-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >

          {/* Premium Accent */}
          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-1
              bg-gradient-to-b
              from-yellow-400
              via-yellow-500
              to-yellow-700
            "
          />

          <div className="p-5 sm:p-6 lg:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Business Logo */}

              <div className="shrink-0">

                {business?.logo ? (

                  <img
                    src={business.logo}
                    alt="Business Logo"
                    className="
                      h-16
                      w-16
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      object-cover
                      shadow-sm
                      sm:h-20
                      sm:w-20
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-950
                      text-2xl
                      font-bold
                      text-yellow-400
                      shadow-sm
                      sm:h-20
                      sm:w-20
                    "
                  >
                    B
                  </div>

                )}

              </div>

              {/* Business Information */}

              <div className="min-w-0 flex-1">

                <div className="mb-1 flex flex-wrap items-center gap-2">

                  <h1
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      sm:text-3xl
                    "
                  >
                    {business?.business_name || "BusinessOS"}
                  </h1>

                  <span
                    className="
                      rounded-full
                      border
                      border-yellow-200
                      bg-yellow-50
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-yellow-700
                    "
                  >
                    BusinessOS
                  </span>

                </div>

                <p className="text-sm text-slate-500 sm:text-base">
                  Welcome back 👋 Manage your business with clarity and control.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span
                    className="
                      rounded-lg
                      bg-slate-100
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      capitalize
                      text-slate-700
                    "
                  >
                    {role} Access
                  </span>

                  <span className="text-xs text-slate-400">
                    •
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    Business Management Workspace
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          KEY BUSINESS METRICS
      ====================================================== */}

      <section>

        <DashboardCards />

      </section>


      {/* =====================================================
          BUSINESS INTELLIGENCE
      ====================================================== */}

      <section className="mt-6">

        <div className="mb-3">

          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Business Intelligence
          </h2>

        </div>

        <LowStockCard
          products={lowStockProducts}
        />

      </section>


      {/* =====================================================
          SALES PERFORMANCE
      ====================================================== */}

      <section className="mt-6">

        <div className="mb-3">

          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Sales Performance
          </h2>

        </div>

        <RecentSalesCard />

        <TopSellingCard />

      </section>


      {/* =====================================================
          NOTIFICATIONS
      ====================================================== */}

      <section className="mt-6">

        <div className="mb-3">

          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Workspace Updates
          </h2>

        </div>

        <NotificationPanel
          notifications={notifications}
        />

      </section>

    </Layout>
  );
}

export default Dashboard;