import { Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";

function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              Name
            </th>

            <th className="p-4 text-left">
              Phone
            </th>

            <th className="p-4 text-left">
              Email
            </th>

            <th className="p-4 text-left">
              Address
            </th>

            <th className="p-4 text-left">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {suppliers.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center p-8 text-gray-500"
              >
                No Suppliers Found
              </td>

            </tr>

          ) : (

            suppliers.map((supplier) => (

              <tr
                key={supplier.id}
                className="border-t"
              >

                <td className="p-4">
                  {supplier.supplier_name}
                </td>

                <td className="p-4">
                  {supplier.phone}
                </td>

                <td className="p-4">
                  {supplier.email}
                </td>

                <td className="p-4">
                  {supplier.address}
                </td>

                <td className="p-4 flex gap-2">

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default SupplierTable;