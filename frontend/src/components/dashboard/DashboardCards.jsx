import StatsCard from "./cards/StatsCard";

function DashboardCards() {
  return (
    <div className="grid grid-cols-4 gap-6">

      <StatsCard
        title="Revenue"
        value="$12,450"
      />

      <StatsCard
        title="Products"
        value="128"
      />

      <StatsCard
        title="Customers"
        value="56"
      />

      <StatsCard
        title="Sales"
        value="324"
      />

    </div>
  );
}

export default DashboardCards;