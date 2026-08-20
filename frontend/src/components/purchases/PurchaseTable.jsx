import { Link } from "react-router-dom";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { deletePurchase } from "../../services/purchases";

function PurchaseTable({ purchases }) {
  async function handleDelete(purchaseId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this purchase?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePurchase(purchaseId);

      alert("Purchase deleted successfully ✅");

      window.location.reload();
    } catch (error) {
      console.error("Delete Purchase Error:", error);
      alert(error.message);
    }
  }

  return (
    <>
      {/* =========================
          DESKTOP TABLE
      ========================== */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Supplier</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-10 text-gray-500"
                >
                  No Purchases Found
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {purchase.invoice_no}
                  </td>

                  <td className="p-4">
                    {purchase.suppliers?.supplier_name || "-"}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {new Date(
                      purchase.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      purchase.total
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {purchase.status}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">

                      {/* Edit */}
                      <Link
                        to={`/purchases/${purchase.id}/edit`}
                        title="Edit Purchase"
                        aria-label="Edit Purchase"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* View */}
                      <Link
                        to={`/purchases/${purchase.id}`}
                        title="View Purchase"
                        aria-label="View Purchase"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(purchase.id)
                        }
                        title="Delete Purchase"
                        aria-label="Delete Purchase"
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                      >
                        <Trash2 size={18} />
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
          MOBILE PURCHASE CARDS
      ========================== */}
      <div className="md:hidden space-y-4 w-full">
        {purchases.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Purchases Found
          </div>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="w-full bg-white border rounded-xl p-4 shadow-sm"
            >

              {/* Purchase Header */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <h3 className="font-semibold text-lg break-words">
                    Invoice
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {purchase.invoice_no || "-"}
                  </p>
                </div>

                {/* Total */}
                <div className="shrink-0 text-right">
                  <p className="text-xs text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      purchase.total
                    ).toLocaleString()}
                  </p>
                </div>

              </div>

              {/* Purchase Details */}
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Supplier
                  </span>

                  <span className="font-medium text-right break-words">
                    {purchase.suppliers?.supplier_name || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Date
                  </span>

                  <span className="font-medium text-right whitespace-nowrap">
                    {new Date(
                      purchase.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="font-semibold text-right whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      purchase.total
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Status
                  </span>

                  <span className="font-medium text-right">
                    {purchase.status || "-"}
                  </span>
                </div>

              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">

                {/* Edit */}
                <Link
                  to={`/purchases/${purchase.id}/edit`}
                  title="Edit Purchase"
                  aria-label="Edit Purchase"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </Link>

                {/* View */}
                <Link
                  to={`/purchases/${purchase.id}`}
                  title="View Purchase"
                  aria-label="View Purchase"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition"
                >
                  <Eye size={17} />
                  <span>View</span>
                </Link>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(purchase.id)
                  }
                  title="Delete Purchase"
                  aria-label="Delete Purchase"
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                >
                  <Trash2 size={17} />
                  <span>Delete</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default PurchaseTable;