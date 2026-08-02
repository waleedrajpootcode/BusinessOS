
function LowStockCard({ products }) {

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-4">
        ⚠ Low Stock Products
      </h2>

      {products.length === 0 ? (

        <p className="text-gray-500">
          No Low Stock Products
        </p>

      ) : (

        <div className="space-y-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="flex justify-between border-b pb-2"
            >

              <span>
                {product.product_name}
              </span>

              <span className="font-bold text-red-500">

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