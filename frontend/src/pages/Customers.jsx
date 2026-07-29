import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
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

  async function loadCustomers() {
    const data = await getCustomers();
    setCustomers(data);
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

      {/* Table */}
      <CustomerTable
        customers={customers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

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