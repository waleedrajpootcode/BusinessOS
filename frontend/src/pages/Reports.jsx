import { useEffect, useState } from "react";
import RevenueChart from "../components/reports/RevenueChart";
import TopSellingProducts from "../components/reports/TopSellingProducts";
import LowStockProducts from "../components/reports/LowStockProducts";
import TopCustomers from "../components/reports/TopCustomers";

import {
  getTotalRevenue,
  getTotalSalesProfit,
  getTotalPurchases,
  getTotalExpenses,
  getNetProfit,
  getMonthlyRevenue,
  getTopSellingProducts,
  getLowStockProducts,
  getTopCustomers,
} from "../services/reports";

import StatsCard from "../components/dashboard/cards/StatsCard";

function Reports() {

  const [revenue, setRevenue] = useState(0);
  const [salesProfit, setSalesProfit] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [profit, setProfit] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);


  useEffect(() => {
    loadReports();

  }, []);

  async function loadReports() {

    setRevenue(await getTotalRevenue());

    setSalesProfit(
      await getTotalSalesProfit()
    );

    setPurchases(
      await getTotalPurchases()
    );

    setExpenses(
      await getTotalExpenses()
    );

    setProfit(
      await getNetProfit()
    );

    setRevenueData(
      await getMonthlyRevenue()
    );

    setTopProducts(
      await getTopSellingProducts()
    );

    setLowStockProducts(
      await getLowStockProducts()
    );

    setTopCustomers(
      await getTopCustomers()
    );

  }

  return (

    <div className="p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Business Analytics Dashboard
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

        <StatsCard
          title="Revenue"
          value={`PKR ${revenue.toLocaleString()}`}
        />

        <StatsCard
          title="Sales Profit"
          value={`PKR ${salesProfit.toLocaleString()}`}
        />

        <StatsCard
          title="Purchases"
          value={`PKR ${purchases.toLocaleString()}`}
        />

        <StatsCard
          title="Expenses"
          value={`PKR ${expenses.toLocaleString()}`}
        />

        <StatsCard
          title="Net Profit"
          value={`PKR ${profit.toLocaleString()}`}
        />

      </div>

      {/* Revenue Chart */}

      <div className="mt-8">

        <RevenueChart
          data={revenueData}
        />

      </div>

      <div className="mt-8">

        <TopSellingProducts
          products={topProducts}
        />

      </div>

      <div className="mt-8">

        <LowStockProducts
          products={lowStockProducts}
        />

      </div>

      <div className="mt-8">

        <TopCustomers
          customers={topCustomers}
        />

      </div>

    </div>

  );

}

export default Reports; 