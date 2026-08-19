import { Pencil, Trash2, BookOpen } from "lucide-react";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">
                Actions
              </th>
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
                    {customer.phone}
                  </td>

                  <td className="p-4">
                    <div className="max-w-[220px] truncate">
                      {customer.email}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="max-w-[220px] truncate">
                      {customer.address}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => onEdit(customer)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                        title="Edit Customer"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(customer.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                        title="Delete Customer"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        onClick={() =>
                          window.location.href = `/customer-ledger/${customer.id}`
                        }
                        title="Customer Udhaar Ledger"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
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
  );
}

export default CustomerTable;