import { Pencil, Trash2 } from "lucide-react";
function EmployeesTable({

  employees,

  onEdit,

  onDelete,

}) {

  return (

    <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">Name</th>

            <th className="p-4 text-left">Email</th>

            <th className="p-4 text-left">Phone</th>

            <th className="p-4 text-left">Role</th>

            <th className="p-4 text-left">Status</th>

            <th className="p-4 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {employees.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center p-10 text-gray-500"
              >

                No Employees Found

              </td>

            </tr>

          ) : (

            employees.map((employee) => (

              <tr
                key={employee.id}
                className="border-t"
              >

                <td className="p-4">
                  {employee.full_name}
                </td>

                <td className="p-4">
                  {employee.email}
                </td>

                <td className="p-4">
                  {employee.phone}
                </td>

                <td className="p-4 capitalize">
                  {employee.role}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${employee.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >

                    {employee.status}

                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(employee)}
                      title="Edit Employee"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete?.(employee.id)}
                      title="Delete Employee"
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

    </div>

  );

}

export default EmployeesTable;