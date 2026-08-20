import { Pencil, Trash2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8 w-full min-w-0 max-w-full overflow-hidden">

      {/* =========================
          DESKTOP SUPPLIER TABLE
      ========================== */}
      <div className="hidden md:block w-full min-w-0 max-w-full bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full table-fixed">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left w-[20%]">
                Name
              </th>

              <th className="p-4 text-left w-[18%]">
                Phone
              </th>

              <th className="p-4 text-left w-[22%]">
                Email
              </th>

              <th className="p-4 text-left w-[25%]">
                Address
              </th>

              <th className="p-4 text-center w-[15%]">
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

                  {/* Name */}
                  <td className="p-4 min-w-0 max-w-0">

                    <div className="truncate">
                      {supplier.supplier_name}
                    </div>

                  </td>

                  {/* Phone */}
                  <td className="p-4 min-w-0 max-w-0">

                    <div className="truncate">
                      {supplier.phone || "-"}
                    </div>

                  </td>

                  {/* Email */}
                  <td className="p-4 min-w-0 max-w-0">

                    <div
                      className="truncate"
                      title={supplier.email || "-"}
                    >
                      {supplier.email || "-"}
                    </div>

                  </td>

                  {/* Address */}
                  <td className="p-4 min-w-0 max-w-0">

                    <div
                      className="truncate"
                      title={supplier.address || "-"}
                    >
                      {supplier.address || "-"}
                    </div>

                  </td>

                  {/* Actions */}
                  <td className="p-4">

                    <div className="flex items-center justify-center gap-1 flex-wrap">

                      {/* Supplier Ledger */}
                      <Link
                        to={`/supplier-ledger/${supplier.id}`}
                        title="Supplier Ledger"
                        aria-label="Supplier Ledger"
                        className="shrink-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                      >
                        <BookOpen size={18} />
                      </Link>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(supplier)}
                        title="Edit Supplier"
                        aria-label="Edit Supplier"
                        className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(supplier.id)}
                        title="Delete Supplier"
                        aria-label="Delete Supplier"
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
          MOBILE SUPPLIER CARDS
      ========================== */}
      <div className="md:hidden w-full min-w-0 max-w-full space-y-4">

        {suppliers.length === 0 ? (

          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Suppliers Found
          </div>

        ) : (

          suppliers.map((supplier) => (

            <div
              key={supplier.id}
              className="w-full min-w-0 max-w-full bg-white border rounded-xl p-4 shadow-sm overflow-hidden"
            >

              {/* Supplier Header */}
              <div className="flex items-start gap-3 min-w-0">

                <div className="min-w-0 flex-1">

                  <h3 className="font-semibold text-lg break-words">
                    {supplier.supplier_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {supplier.phone || "No phone"}
                  </p>

                </div>

              </div>


              {/* Supplier Details */}
              <div className="mt-4 space-y-3 text-sm">

                <div className="flex items-start justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Phone
                  </span>

                  <span className="font-medium text-right break-all min-w-0 max-w-[70%]">
                    {supplier.phone || "-"}
                  </span>

                </div>


                <div className="flex items-start justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Email
                  </span>

                  <span className="font-medium text-right break-all min-w-0 max-w-[70%]">
                    {supplier.email || "-"}
                  </span>

                </div>


                <div className="flex items-start justify-between gap-4 min-w-0">

                  <span className="text-gray-500 shrink-0">
                    Address
                  </span>

                  <span className="font-medium text-right break-words min-w-0 max-w-[70%]">
                    {supplier.address || "-"}
                  </span>

                </div>

              </div>


              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2">

                {/* Supplier Ledger */}
                <Link
                  to={`/supplier-ledger/${supplier.id}`}
                  title="Supplier Ledger"
                  aria-label="Supplier Ledger"
                  className="min-w-0 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-2 rounded-lg transition"
                >
                  <BookOpen size={17} />
                  <span className="text-sm">
                    Ledger
                  </span>
                </Link>


                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(supplier)}
                  title="Edit Supplier"
                  aria-label="Edit Supplier"
                  className="min-w-0 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-2 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span className="text-sm">
                    Edit
                  </span>
                </button>


                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(supplier.id)}
                  title="Delete Supplier"
                  aria-label="Delete Supplier"
                  className="min-w-0 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-2 rounded-lg transition"
                >
                  <Trash2 size={17} />
                  <span className="text-sm">
                    Delete
                  </span>
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default SupplierTable;