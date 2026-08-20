import { Pencil, Trash2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8">

      {/* =========================
          DESKTOP SUPPLIER TABLE
      ========================== */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Actions</th>
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
                    <td className="p-4 whitespace-nowrap">
                      {supplier.supplier_name}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {supplier.phone || "-"}
                    </td>

                    <td className="p-4">
                      <div className="max-w-[220px] truncate">
                        {supplier.email || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="max-w-[220px] truncate">
                        {supplier.address || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 whitespace-nowrap">

                        {/* Supplier Ledger */}
                        <Link
                          to={`/supplier-ledger/${supplier.id}`}
                          title="Supplier Ledger"
                          aria-label="Supplier Ledger"
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                        >
                          <BookOpen size={18} />
                        </Link>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(supplier)}
                          title="Edit Supplier"
                          aria-label="Edit Supplier"
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(supplier.id)}
                          title="Delete Supplier"
                          aria-label="Delete Supplier"
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
      </div>

      {/* =========================
          MOBILE SUPPLIER CARDS
      ========================== */}
      <div className="md:hidden space-y-4 w-full">

        {suppliers.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Suppliers Found
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="w-full bg-white border rounded-xl p-4 shadow-sm"
            >

              {/* Supplier Header */}
              <div className="flex items-start gap-3">

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

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Phone
                  </span>

                  <span className="font-medium text-right break-all">
                    {supplier.phone || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Email
                  </span>

                  <span className="font-medium text-right break-all">
                    {supplier.email || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Address
                  </span>

                  <span className="font-medium text-right break-words">
                    {supplier.address || "-"}
                  </span>
                </div>

              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">

                {/* Supplier Ledger */}
                <Link
                  to={`/supplier-ledger/${supplier.id}`}
                  title="Supplier Ledger"
                  aria-label="Supplier Ledger"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition"
                >
                  <BookOpen size={17} />
                  <span>Ledger</span>
                </Link>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(supplier)}
                  title="Edit Supplier"
                  aria-label="Edit Supplier"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(supplier.id)}
                  title="Delete Supplier"
                  aria-label="Delete Supplier"
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

    </div>
  );
}

export default SupplierTable;