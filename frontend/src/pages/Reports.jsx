import { useEffect, useState } from "react";

import {
  getTotalRevenue,
  getTotalPurchases,
  getTotalExpenses,
  getNetProfit,
} from "../services/reports";

import StatsCard from "../components/dashboard/cards/StatsCard";

function Reports() {

  const [revenue, setRevenue] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {

    setRevenue(await getTotalRevenue());

    setPurchases(await getTotalPurchases());

    setExpenses(await getTotalExpenses());

    setProfit(await getNetProfit());

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

      <div className="grid grid-cols-4 gap-6">

        <StatsCard
          title="Revenue"
          value={`PKR ${revenue.toLocaleString()}`}
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

    </div>

  );

}

export default Reports; 