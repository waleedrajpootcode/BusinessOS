function LowStockCard({ products }) {
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
          via-orange-500
          to-red-500
        "
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <div
              className="
                flex
                items-center
                justify-center
                w-9
                h-9
                shrink-0
                rounded-lg
                bg-amber-50
                text-amber-600
              "
              aria-hidden="true"
            >
              ⚠
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Low Stock Products
            </h2>

          </div>

          <p className="text-sm text-slate-500 mt-2">
            Products that need stock attention.
          </p>

        </div>

        {products.length > 0 && (
          <span
            className="
              shrink-0
              px-2.5
              py-1
              rounded-full
              bg-red-50
              text-red-600
              text-xs
              font-bold
            "
          >
            {products.length}
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
            py-6
            text-center
          "
        >
          <p className="text-sm font-medium text-slate-600">
            No Low Stock Products
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Your current inventory looks healthy.
          </p>

        </div>

      ) : (

        <div className="space-y-2">

          {products.map((product) => (

            <div
              key={product.id}
              className="
                flex
                items-center
                justify-between
                gap-4
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

              {/* Product Name */}
              <span
                className="
                  min-w-0
                  flex-1
                  break-words
                  font-medium
                  text-slate-800
                "
              >
                {product.product_name}
              </span>

              {/* Stock */}
              <span
                className="
                  shrink-0
                  min-w-10
                  text-center
                  px-2
                  py-1
                  rounded-lg
                  bg-red-50
                  text-red-600
                  font-bold
                  text-sm
                  whitespace-nowrap
                "
              >
                {product.stock}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default LowStockCard;