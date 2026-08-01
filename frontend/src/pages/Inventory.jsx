import { useEffect, useState } from "react";
import { getInventory } from "../services/products";

function Inventory() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const data = await getInventory();
    setProducts(data);
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Inventory
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor your stock and inventory levels.
        </p>

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Products..."
        className="w-full border rounded-lg p-3 mb-6"
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center p-10 text-gray-500"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr
                  key={product.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {product.product_name}
                  </td>

                  <td className="p-4">
                    PKR {Number(product.price).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">

                    {product.stock === 0 ? (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Out of Stock
                      </span>

                    ) : product.stock <= 5 ? (

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>

                    ) : (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        In Stock
                      </span>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Inventory;