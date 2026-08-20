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
    <div className="w-full max-w-full min-w-0 overflow-hidden">

      {/* =========================
          DESKTOP TABLE
      ========================== */}
      <div className="hidden md:block w-full max-w-full min-w-0 overflow-hidden">

        <table className="w-full table-fixed">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left w-[16%]">
                Invoice
              </th>

              <th className="p-4 text-left w-[20%]">
                Supplier
              </th>

              <th className="p-4 text-left w-[15%]">
                Date
              </th>

              <th className="p-4 text-left w-[15%]">
                Total
              </th>

              <th className="p-4 text-left w-[14%]">
                Status
              </th>

              <th className="p-4 text-center w-[20%]">
                Actions
              </th>
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

                  {/* Invoice */}
                  <td className="p-4 min-w-0">
                    <div className="truncate">
                      {purchase.invoice_no || "-"}
                    </div>
                  </td>

                  {/* Supplier */}
                  <td className="p-4 min-w-0">
                    <div className="truncate">
                      {purchase.suppliers?.supplier_name || "-"}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-4 min-w-0">
                    <div className="whitespace-nowrap">
                      {new Date(
                        purchase.created_at
                      ).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="p-4 min-w-0">
                    <div className="whitespace-nowrap">
                      PKR{" "}
                      {Number(
                        purchase.total || 0
                      ).toLocaleString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4 min-w-0">
                    <div className="truncate">
                      {purchase.status || "-"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">

                    <div className="flex justify-center items-center gap-2">

                      {/* Edit */}
                      <Link
                        to={`/purchases/${purchase.id}/edit`}
                        title="Edit Purchase"
                        aria-label="Edit Purchase"
                        className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* View */}
                      <Link
                        to={`/purchases/${purchase.id}`}
                        title="View Purchase"
                        aria-label="View Purchase"
                        className="shrink-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
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
                        className="shrink-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
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
      <div className="md:hidden w-full max-w-full min-w-0 space-y-4">

        {purchases.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Purchases Found
          </div>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="w-full max-w-full min-w-0 bg-white border rounded-xl p-4 shadow-sm overflow-hidden"
            >

              {/* Purchase Header */}
<div className="w-full min-w-0">

  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
    Invoice
  </p>

  <p className="mt-1 font-semibold text-base text-gray-900 break-all">
    {purchase.invoice_no || "-"}
  </p>

</div>


              {/* Purchase Details */}
              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Supplier
                  </span>

                  <span className="font-medium text-right break-words min-w-0">
                    {purchase.suppliers?.supplier_name || "-"}
                  </span>

                </div>

                <div className="flex justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Date
                  </span>

                  <span className="font-medium text-right whitespace-nowrap">
                    {new Date(
                      purchase.created_at
                    ).toLocaleDateString()}
                  </span>

                </div>

                <div className="flex justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Total
                  </span>

                  <span className="font-semibold text-right whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      purchase.total || 0
                    ).toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Status
                  </span>

                  <span className="font-medium text-right break-words">
                    {purchase.status || "-"}
                  </span>

                </div>

              </div>


              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2 min-w-0">

                <Link
                  to={`/purchases/${purchase.id}/edit`}
                  title="Edit Purchase"
                  aria-label="Edit Purchase"
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </Link>

                <Link
                  to={`/purchases/${purchase.id}`}
                  title="View Purchase"
                  aria-label="View Purchase"
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition"
                >
                  <Eye size={17} />
                  <span>View</span>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(purchase.id)
                  }
                  title="Delete Purchase"
                  aria-label="Delete Purchase"
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                >
                  <Trash2 size={17} />
                  <span>Delete</span>
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default PurchaseTable;