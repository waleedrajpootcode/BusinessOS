import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function RevenueChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">

        Revenue Trend

      </h2>

      <div className="w-full h-80">

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default RevenueChart;