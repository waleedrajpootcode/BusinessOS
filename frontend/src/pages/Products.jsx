import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import {
  getProducts,
  deleteProduct,
} from "../services/products";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      alert("Product Deleted Successfully ✅");

      loadProducts();

    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);
  const filteredProducts = products.filter((product) => {
    return (
      product.product_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      product.sku
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      product.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
      />
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