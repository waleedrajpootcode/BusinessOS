import { useEffect, useState } from "react";
import StatsCard from "./cards/StatsCard";
import { getProductsCount } from "../../services/products";
import { getCustomersCount } from "../../services/customers";

function DashboardCards() {
  const [productsCount, setProductsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const products = await getProductsCount();
      const customers = await getCustomersCount();

      setProductsCount(products);
      setCustomersCount(customers);
    }

    loadData();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatsCard
        title="Revenue"
        value="$0"
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
        value="0"
      />
    </div>
  );
}

export default DashboardCards;