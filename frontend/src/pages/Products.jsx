import { useState } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your business products.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Product
        </Button>

      </div>

      {/* Search */}
      <div className="mt-8">

        <input
          type="text"
          placeholder="Search Products..."
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl shadow border">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="5"
                className="text-center p-10 text-gray-500"
              >
                No Products Found
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      {/* Modal */}
    <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Add Product"
>
  <ProductForm />

  <div className="flex justify-end mt-4">
    <Button onClick={() => setIsModalOpen(false)}>
      Close
    </Button>
  </div>

</Modal>

    </div>
  );
}

export default Products;