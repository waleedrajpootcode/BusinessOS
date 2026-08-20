function LowStockCard({ products }) {
  return (
    <div className="w-full min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          ⚠ Low Stock Products
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Products that need stock attention.
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (

        <p className="text-gray-500 py-4">
          No Low Stock Products
        </p>

      ) : (

        <div className="space-y-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="flex items-center justify-between gap-4 border-b last:border-b-0 pb-3 last:pb-0 min-w-0"
            >

              {/* Product Name */}
              <span className="min-w-0 flex-1 break-words font-medium">
                {product.product_name}
              </span>

              {/* Stock */}
              <span className="shrink-0 font-bold text-red-500 whitespace-nowrap">
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