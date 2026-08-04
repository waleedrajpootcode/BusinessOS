function LowStockProducts({ products }) {

  return (

    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-xl font-bold mb-6">

        ⚠ Low Stock Products

      </h2>

      <div className="space-y-3">

        {products.length === 0 ? (

          <p className="text-green-600">

            All products are sufficiently stocked.

          </p>

        ) : (

          products.map((item) => (

            <div
              key={item.id}
              className="flex justify-between border-b pb-2"
            >

              <span>{item.product_name}</span>

              <span
                className={
                  item.stock === 0
                    ? "text-red-600 font-bold"
                    : "text-orange-500 font-bold"
                }
              >
                {item.stock === 0
                  ? "OUT OF STOCK"
                  : `${item.stock} Left`}
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default LowStockProducts;