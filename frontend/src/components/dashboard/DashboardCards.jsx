import { useEffect, useState } from "react";
import StatsCard from "./cards/StatsCard";
import { getProductsCount } from "../../services/products";

function DashboardCards() {
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const count = await getProductsCount();
      setProductsCount(count);
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
        value="0"
      />

      <StatsCard
        title="Sales"
        value="0"
      />

    </div>
  );
}

export default DashboardCards;