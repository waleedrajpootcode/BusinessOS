import {
  Pencil,
  Trash2,
  Barcode,
} from "lucide-react";

function ProductTable({
  products,
  onDelete,
  onEdit,
}) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow border overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">SKU</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Cost Price</th>
            <th className="p-4 text-left">Selling Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {products.length === 0 ? (
            <tr>
              <td
                colSpan="7"
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
                <td className="p-4">{product.product_name}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">
                  PKR {product.cost_price}
                </td>

                <td className="p-4">
                  PKR {product.price}
                </td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex gap-2">

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                    >

                      <Barcode size={18} />

                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default ProductTable;