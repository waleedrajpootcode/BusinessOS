import Layout from "../components/dashboard/Layout";
import DashboardCards from "../components/dashboard/DashboardCards";
import LowStockCard from "../components/dashboard/LowStockCard";
import RecentSalesCard from "../components/dashboard/RecentSalesCard";

function Dashboard() {
  return (
    <Layout>

      <DashboardCards />

      <LowStockCard />

      <RecentSalesCard />

    </Layout>
  );
}

export default Dashboard;