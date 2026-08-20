import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import PurchaseForm from "../components/purchases/PurchaseForm";
import PurchaseTable from "../components/purchases/PurchaseTable";
import { getPurchases } from "../services/purchases";

function Purchases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    const data = await getPurchases();
    setPurchases(data);
  }

  const filteredPurchases = purchases.filter((purchase) => {
    const search = searchTerm.toLowerCase();

    return (
      purchase.invoice_no?.toLowerCase().includes(search) ||
      purchase.suppliers?.supplier_name
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Purchases
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage all purchases from suppliers.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          + New Purchase
        </Button>

      </div>

      {/* Search */}
      <div className="mt-6 sm:mt-8">

        <input
          type="text"
          placeholder="Search Purchases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

      </div>

      {/* Table */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow border overflow-hidden">

        <div className="w-full overflow-x-auto">
          <PurchaseTable
            purchases={filteredPurchases}
          />
        </div>

      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Purchase"
      >

        <PurchaseForm
          onSuccess={() => {
            loadPurchases();
            setIsModalOpen(false);
          }}
        />

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