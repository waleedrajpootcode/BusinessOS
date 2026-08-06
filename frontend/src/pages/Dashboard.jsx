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

    const products =
      await getLowStockProducts();

    setLowStockProducts(products);

    setNotifications(
      await getNotifications()
    );

  }

  return (

    <Layout>

      <div className="mb-6 bg-white rounded-xl shadow border p-6">

        <div className="flex items-center gap-4">

          {business?.logo ? (

            <img
              src={business.logo}
              alt="Business Logo"
              className="w-16 h-16 rounded-lg object-cover border"
            />

          ) : (

            <div className="w-16 h-16 rounded-lg bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              B
            </div>

          )}

          <div>

            <h1 className="text-3xl font-bold">

              {business?.business_name || "BusinessOS"}

            </h1>

            <p className="text-gray-500 mt-1">

              Welcome back 👋 Manage your business easily.

            </p>

            <p className="text-sm mt-2">

              Role: <span className="font-semibold">
                {role}
              </span>

            </p>

          </div>

        </div>

      </div>

      <DashboardCards />

      <LowStockCard
        products={lowStockProducts}
      />

      <RecentSalesCard />

      <TopSellingCard />

      <NotificationPanel
        notifications={notifications}
      />

    </Layout>

  );

}

export default Dashboard;