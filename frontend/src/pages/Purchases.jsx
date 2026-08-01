import { useState } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import PurchaseForm from "../components/purchases/PurchaseForm";

function Purchases() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Purchases
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all purchases from suppliers.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
        >
          + New Purchase
        </Button>

      </div>

      {/* Search */}
      <div className="mt-8">

        <input
          type="text"
          placeholder="Search Purchases..."
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Supplier</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="6"
                className="text-center p-10 text-gray-500"
              >
                No Purchases Found
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Purchase"
      >
        <PurchaseForm />

        <div className="flex justify-end mt-4">

          <Button
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>

        </div>

      </Modal>

    </div>
  );
}

export default Purchases;