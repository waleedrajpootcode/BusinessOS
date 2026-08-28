import { useEffect, useState } from "react";
import { getTopSellingProducts } from "../../../services/sales";

function TopSellingCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getTopSellingProducts();
    setProducts(data);
  }

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
          from-amber-400
          via-yellow-500
          to-orange-400
        "
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">

        <div className="min-w-0">

          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Top Selling Products
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Products generating the most sales revenue.
          </p>

        </div>

        {products.length > 0 && (
          <span
            className="
              shrink-0
              px-2.5
              py-1
              rounded-full
              bg-amber-50
              text-amber-700
              text-xs
              font-bold
            "
          >
            Top {products.length}
          </span>
        )}

      </div>

      {/* Empty State */}
      {products.length === 0 ? (

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
          <div className="text-2xl mb-2">
            📊
          </div>

          <p className="text-sm font-semibold text-slate-600">
            No Sales Data
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Top-selling products will appear here once sales are recorded.
          </p>

        </div>

      ) : (

        <div className="space-y-2">

          {products.map((product, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-slate-100
                bg-slate-50/70
                px-3
                sm:px-4
                py-3
                min-w-0
                transition
                duration-200
                hover:bg-slate-100
              "
            >

              {/* Ranking */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-8
                  h-8
                  shrink-0
                  rounded-lg
                  bg-white
                  border
                  border-slate-200
                  text-sm
                  font-bold
                  text-slate-600
                "
              >
                {index + 1}
              </div>

              {/* Product Information */}
              <div className="min-w-0 flex-1">

                <p
                  className="
                    font-semibold
                    text-slate-900
                    break-words
                  "
                >
                  {product.product_name}
                </p>

                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Sold:{" "}
                  <span className="font-semibold text-slate-700">
                    {product.quantity}
                  </span>
                </p>

              </div>

              {/* Revenue */}
              <div className="text-right shrink-0">

                <p
                  className="
                    font-bold
                    text-slate-900
                    text-sm
                    sm:text-base
                    whitespace-nowrap
                  "
                >
                  PKR {Number(product.revenue).toLocaleString()}
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  Revenue
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default TopSellingCard;