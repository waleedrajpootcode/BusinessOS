import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierTable from "../components/suppliers/SupplierTable";
import {
  getSuppliers,
  deleteSupplier,
} from "../services/suppliers";

function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  async function loadSuppliers() {
    const data = await getSuppliers();
    setSuppliers(data);
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) return;

    try {

      await deleteSupplier(id);

      alert("Supplier Deleted Successfully ✅");

      loadSuppliers();

    } catch (error) {

      alert(error.message);

    }

  }

  function handleEdit(supplier) {

    setSelectedSupplier(supplier);

    setIsModalOpen(true);

  }

  return (

    <div className="p-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Suppliers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all suppliers.
          </p>

        </div>

        <Button
          onClick={() => {

            setSelectedSupplier(null);

            setIsModalOpen(true);

          }}
        >
          + Add Supplier
        </Button>

      </div>

      <div className="mt-8">

        <input
          type="text"
          placeholder="Search Suppliers..."
          className="w-full border rounded-lg p-3"
        />

      </div>

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedSupplier
            ? "Edit Supplier"
            : "Add Supplier"
        }
      >

        <SupplierForm
          supplier={selectedSupplier}
          onSuccess={() => {

            setIsModalOpen(false);

            setSelectedSupplier(null);

            loadSuppliers();

          }}
        />

        <div className="flex justify-end mt-4">

          <Button
            onClick={() =>
              setIsModalOpen(false)
            }
          >
            Close
          </Button>

        </div>

      </Modal>

    </div>

  );

}

export default Suppliers;