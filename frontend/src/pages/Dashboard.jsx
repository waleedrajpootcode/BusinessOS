import { useEffect, useState } from "react";

import Layout from "../components/dashboard/Layout";
import DashboardCards from "../components/dashboard/DashboardCards";
import LowStockCard from "../components/dashboard/cards/LowStockCard";
import RecentSalesCard from "../components/dashboard/RecentSalesCard";
import TopSellingCard from "../components/dashboard/cards/TopSellingCard";
import { getLowStockProducts } from "../services/dashboard";

function Dashboard() {

  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    const products =
      await getLowStockProducts();

    setLowStockProducts(products);

  }

  return (

    <Layout>

      <DashboardCards />

      <LowStockCard
        products={lowStockProducts}
      />

      <RecentSalesCard />

      <TopSellingCard />

    </Layout>

  );

}

export default Dashboard;