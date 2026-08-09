import { useState } from "react";
import ProductBarcodeModal from "./ProductBarcodeModal";
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
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] =
    useState(null);

  return (
    <>
      {/* =========================
          DESKTOP TABLE
      ========================== */}
      <div className="hidden md:block rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Cost Price</th>
              <th className="p-4 text-left">Selling Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Actions</th>
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
                  <td className="p-4">
                    {product.product_name}
                  </td>

                  <td className="p-4">
                    {product.sku || "-"}
                  </td>

                  <td className="p-4">
                    {product.category || "-"}
                  </td>

                  <td className="p-4">
                    PKR{" "}
                    {Number(
                      product.cost_price
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    PKR{" "}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {product.stock}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(product)
                        }
                        title="Edit Product"
                        aria-label="Edit Product"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(product.id)
                        }
                        title="Delete Product"
                        aria-label="Delete Product"
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Barcode */}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedBarcodeProduct(
                            product
                          )
                        }
                        title="View Barcode"
                        aria-label="View Barcode"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
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

      {/* =========================
          MOBILE PRODUCT CARDS
      ========================== */}
      <div className="md:hidden space-y-4 w-full">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Products Found
          </div>
        ) : (
          products.map((product) => (
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

                  <p className="text-sm text-gray-500 mt-1">
                    SKU: {product.sku || "-"}
                  </p>
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
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium text-right">
                    {product.category || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Cost Price
                  </span>

                  <span className="font-medium text-right">
                    PKR{" "}
                    {Number(
                      product.cost_price
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Selling Price
                  </span>

                  <span className="font-semibold text-right">
                    PKR{" "}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Barcode
                  </span>

                  <span className="font-medium text-right break-all">
                    {product.barcode || "No barcode"}
                  </span>
                </div>

              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">

                {/* Edit */}
                <button
                  type="button"
                  onClick={() =>
                    onEdit(product)
                  }
                  title="Edit Product"
                  aria-label="Edit Product"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    onDelete(product.id)
                  }
                  title="Delete Product"
                  aria-label="Delete Product"
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                >
                  <Trash2 size={17} />
                  <span>Delete</span>
                </button>

                {/* Barcode */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedBarcodeProduct(
                      product
                    )
                  }
                  title="View Barcode"
                  aria-label="View Barcode"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition"
                >
                  <Barcode size={17} />
                  <span>Barcode</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Barcode Modal */}
      <ProductBarcodeModal
        product={selectedBarcodeProduct}
        onClose={() =>
          setSelectedBarcodeProduct(null)
        }
      />
    </>
  );
}

export default ProductTable;

