import { useEffect, useState } from "react";
import { getRecentSales } from "../../services/sales";

function RecentSalesCard() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    async function loadSales() {
      const data = await getRecentSales();
      setSales(data);
    }

    loadSales();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow border p-6 mt-6">

      <h2 className="text-xl font-bold mb-4">
        Recent Sales
      </h2>

      {sales.length === 0 ? (

        <p className="text-gray-500">
          No Sales Found
        </p>

      ) : (

        <div className="space-y-4">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="flex justify-between items-center border-b pb-3"
            >

              <div>

                <p className="font-semibold">
                  {sale.invoice_no}
                </p>

                <p className="text-sm text-gray-500">
                  {sale.customers?.full_name}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold">
                  PKR {Number(sale.total).toLocaleString()}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(sale.created_at).toLocaleDateString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentSalesCard;