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
    <div
      className="
        group
        relative
        w-full
        min-w-0
        overflow-hidden
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-4
        sm:p-6
        mt-6
        transition-all
        duration-300
        hover:shadow-lg
      "
    >

      {/* Accent Line */}
      <div
        className="
          absolute
          top-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          from-blue-700
          via-blue-500
          to-cyan-400
        "
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">

        <div className="min-w-0">

          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Recent Sales
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Latest transactions across your business.
          </p>

        </div>

        {sales.length > 0 && (
          <span
            className="
              shrink-0
              px-2.5
              py-1
              rounded-full
              bg-blue-50
              text-blue-600
              text-xs
              font-bold
            "
          >
            {sales.length}
          </span>
        )}

      </div>

      {/* Empty State */}
      {sales.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-200
            bg-slate-50
            px-4
            py-8
            text-center
          "
        >
          <p className="text-sm font-semibold text-slate-600">
            No Sales Found
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Recent sales will appear here once transactions are recorded.
          </p>

        </div>

      ) : (

        <div className="space-y-2">

          {sales.map((sale) => (

            <div
              key={sale.id}
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
                rounded-xl
                border
                border-slate-100
                bg-slate-50/70
                px-4
                py-3
                min-w-0
                transition
                duration-200
                hover:bg-slate-100
              "
            >

              {/* Sale Information */}
              <div className="min-w-0 flex-1">

                <p
                  className="
                    font-semibold
                    text-slate-900
                    break-words
                  "
                >
                  {sale.invoice_no}
                </p>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                    break-words
                  "
                >
                  {sale.customers?.full_name || "Walk-in Customer"}
                </p>

              </div>

              {/* Sale Amount + Date */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  sm:block
                  sm:text-right
                  shrink-0
                "
              >

                <p
                  className="
                    font-bold
                    text-slate-900
                    whitespace-nowrap
                  "
                >
                  PKR {Number(sale.total).toLocaleString()}
                </p>

                <p
                  className="
                    text-xs
                    text-slate-400
                    mt-1
                    whitespace-nowrap
                  "
                >
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