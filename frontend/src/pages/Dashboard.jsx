import { useEffect, useState } from "react";

import Layout from "../components/dashboard/Layout";
import DashboardCards from "../components/dashboard/DashboardCards";
import LowStockCard from "../components/dashboard/cards/LowStockCard";
import RecentSalesCard from "../components/dashboard/RecentSalesCard";
import TopSellingCard from "../components/dashboard/cards/TopSellingCard";
import { getLowStockProducts } from "../services/dashboard";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import { getNotifications } from "../services/notifications";


function Dashboard() {

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);


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