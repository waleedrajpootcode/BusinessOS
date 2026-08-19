import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import AlertMessage from "../components/ui/AlertMessage";
import Modal from "../components/ui/Modal";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import {
  getCustomers,
  deleteCustomer,
} from "../services/customers";

function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Load Customers Error:", error);
      setError("Unable to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(id);

      alert("Customer Deleted Successfully ✅");

      loadCustomers();

    } catch (error) {
      alert(error.message);
    }
  }

  function handleEdit(customer) {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all your customers.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedCustomer(null);
            setIsModalOpen(true);
          }}
        >
          + Add Customer
        </Button>

      </div>

      {error && (
        <AlertMessage
          type="error"
          message={error}
        />
      )}

      {/* Table */}
      {loading ? (
        <div
          className="mt-8 bg-white rounded-xl shadow border p-10 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
              aria-hidden="true"
            />
            <p className="text-gray-500">
              Loading customers...
            </p>
          </div>
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        title={
          selectedCustomer
            ? "Edit Customer"
            : "Add Customer"
        }
      >
        <CustomerForm
          customer={selectedCustomer}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
            loadCustomers();
          }}
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              setIsModalOpen(false);
              setSelectedCustomer(null);
            }}
          >
            Close
          </Button>
        </div>

      </Modal>

    </div>
  );
}

export default Customers;