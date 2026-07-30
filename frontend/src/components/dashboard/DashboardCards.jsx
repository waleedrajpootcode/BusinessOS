import { useEffect, useState } from "react";
import StatsCard from "./cards/StatsCard";
import { getProductsCount } from "../../services/products";
import { getCustomersCount } from "../../services/customers";
import {
  getSalesCount,
  getRevenue,
} from "../../services/sales";

function DashboardCards() {
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    async function loadData() {
      const products = await getProductsCount();
      const customers = await getCustomersCount();
      const sales = await getSalesCount();
      const totalRevenue = await getRevenue();

      setProductsCount(products);
      setCustomersCount(customers);
      setSalesCount(sales);
      setRevenue(totalRevenue);
    }

    loadData();

  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">

      <StatsCard
        title="Revenue"
        value={`PKR ${revenue.toLocaleString()}`}
      />

      <StatsCard
        title="Products"
        value={productsCount}
      />

      <StatsCard
        title="Customers"
        value={customersCount}
      />

      <StatsCard
        title="Sales"
        value={salesCount}
      />

    </div>
  );
}

export default DashboardCards;