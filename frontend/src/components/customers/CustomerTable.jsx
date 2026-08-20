import { Pencil, Trash2, BookOpen } from "lucide-react";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8">

      {/* =========================
          DESKTOP CUSTOMER TABLE
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
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-500"
                  >
                    No Customers Found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {customer.full_name}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {customer.phone || "-"}
                    </td>

                    <td className="p-4">
                      <div className="max-w-[220px] truncate">
                        {customer.email || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="max-w-[220px] truncate">
                        {customer.address || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 whitespace-nowrap">

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(customer)}
                          title="Edit Customer"
                          aria-label="Edit Customer"
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(customer.id)}
                          title="Delete Customer"
                          aria-label="Delete Customer"
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>

                        {/* Customer Ledger */}
                        <button
                          type="button"
                          onClick={() =>
                            window.location.href =
                              `/customer-ledger/${customer.id}`
                          }
                          title="Customer Udhaar Ledger"
                          aria-label="Customer Udhaar Ledger"
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                        >
                          <BookOpen size={18} />
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
          MOBILE CUSTOMER CARDS
      ========================== */}
      <div className="md:hidden space-y-4 w-full">

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Customers Found
          </div>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="w-full bg-white border rounded-xl p-4 shadow-sm"
            >

              {/* Customer Header */}
              <div className="flex items-start gap-3">

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg break-words">
                    {customer.full_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {customer.phone || "No phone"}
                  </p>
                </div>

              </div>

              {/* Customer Details */}
              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Phone
                  </span>

                  <span className="font-medium text-right break-all">
                    {customer.phone || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Email
                  </span>

                  <span className="font-medium text-right break-all">
                    {customer.email || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">
                    Address
                  </span>

                  <span className="font-medium text-right break-words">
                    {customer.address || "-"}
                  </span>
                </div>

              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  title="Edit Customer"
                  aria-label="Edit Customer"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(customer.id)}
                  title="Delete Customer"
                  aria-label="Delete Customer"
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                >
                  <Trash2 size={17} />
                  <span>Delete</span>
                </button>

                {/* Customer Ledger */}
                <button
                  type="button"
                  onClick={() =>
                    window.location.href =
                      `/customer-ledger/${customer.id}`
                  }
                  title="Customer Udhaar Ledger"
                  aria-label="Customer Udhaar Ledger"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition"
                >
                  <BookOpen size={17} />
                  <span>Ledger</span>
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default CustomerTable;