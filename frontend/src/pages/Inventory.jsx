import { useEffect, useState } from "react";
import { getInventory } from "../services/products";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const data = await getInventory();
    setProducts(data);
  }

  const filteredProducts = products.filter((product) =>
    product.product_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 min-w-0 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* =========================
          DESKTOP / TABLET TABLE
      ========================== */}
      <div className="hidden md:block w-full max-w-full bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full table-fixed">
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-10 text-gray-500"
                >
                  No Products Found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t"
                >
                  <td className="p-4 break-words">
                    {product.product_name}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {product.stock}
                  </td>

                  <td className="p-4">
                    {product.stock === 0 ? (
                      <span className="inline-block whitespace-nowrap bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="inline-block whitespace-nowrap bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-block whitespace-nowrap bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
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

      {/* =========================
          MOBILE INVENTORY CARDS
      ========================== */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Products Found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-full bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg break-words">
                    {product.product_name}
                  </h3>
                </div>

                {/* Stock */}
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">
                    Stock
                  </p>

                  <p className="font-semibold">
                    {product.stock}
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Price
                  </span>

                  <span className="font-semibold text-right whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span className="text-right">
                    {product.stock === 0 ? (
                      <span className="inline-block whitespace-nowrap bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="inline-block whitespace-nowrap bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-block whitespace-nowrap bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        In Stock
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Inventory;