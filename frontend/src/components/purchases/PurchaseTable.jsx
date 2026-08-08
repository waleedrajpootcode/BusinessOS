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
                {purchase.suppliers?.supplier_name}
              </td>

              <td className="p-4">
                {new Date(
                  purchase.created_at
                ).toLocaleDateString()}
              </td>

              <td className="p-4">
                PKR {Number(purchase.total).toLocaleString()}
              </td>

              <td className="p-4">
                {purchase.status}
              </td>




<td className="p-4 text-center">
  <div className="flex justify-center items-center gap-2">

    {/* Edit */}
    <Link
      to={`/purchases/${purchase.id}/edit`}
      title="Edit Purchase"
      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
    >
      <Pencil size={18} />
    </Link>

    {/* View */}
    <Link
      to={`/purchases/${purchase.id}`}
      title="View Purchase"
      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
    >
      <Eye size={18} />
    </Link>

    {/* Delete */}
    <button
      type="button"
      onClick={() => handleDelete(purchase.id)}
      title="Delete Purchase"
      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
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
  );
}

export default PurchaseTable;