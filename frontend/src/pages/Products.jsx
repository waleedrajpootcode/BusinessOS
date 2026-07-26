import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import { getProducts } from "../services/products";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  async function loadProducts() {
  const data = await getProducts();
  setProducts(data);
}
  useEffect(() => {
  loadProducts();
}, []);

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
<ProductTable products={products} />

      {/* Modal */}
    <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Add Product"
>
  <ProductForm
  onSuccess={() => {
    setIsModalOpen(false);
    loadProducts();
  }}
/>

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