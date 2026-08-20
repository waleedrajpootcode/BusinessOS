import { Pencil, Trash2 } from "lucide-react";

function EmployeesTable({
    employees,
    onEdit,
    onDelete,
}) {
    return (
        <div className="mt-8">

            {/* =========================
                DESKTOP / TABLET TABLE
            ========================== */}
            <div className="hidden md:block w-full max-w-full bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full table-fixed">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left w-[18%]">
                                Name
                            </th>

                            <th className="p-4 text-left w-[25%]">
                                Email
                            </th>

                            <th className="p-4 text-left w-[17%]">
                                Phone
                            </th>

                            <th className="p-4 text-left w-[13%]">
                                Role
                            </th>

                            <th className="p-4 text-left w-[12%]">
                                Status
                            </th>

                            <th className="p-4 text-left w-[15%]">
                                Actions
                            </th>

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

                                    <td className="p-4 break-words">
                                        {employee.full_name}
                                    </td>

                                    <td className="p-4">
                                        <div className="truncate">
                                            {employee.email || "-"}
                                        </div>
                                    </td>

                                    <td className="p-4 whitespace-nowrap">
                                        {employee.phone || "-"}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {employee.role || "-"}
                                    </td>

                                    <td className="p-4">

                                        <span
    className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-sm ${
        employee.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
    }`}
>
    {employee.status}
</span>

                                    </td>

                                    <td className="p-4">

                                        <div className="flex gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(employee)
                                                }
                                                title="Edit Employee"
                                                aria-label="Edit Employee"
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete?.(employee.id)
                                                }
                                                title="Delete Employee"
                                                aria-label="Delete Employee"
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
                MOBILE EMPLOYEE CARDS
            ========================== */}
            <div className="md:hidden space-y-4">

                {employees.length === 0 ? (

                    <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                        No Employees Found
                    </div>

                ) : (

                    employees.map((employee) => (

                        <div
                            key={employee.id}
                            className="w-full bg-white border rounded-xl p-4 shadow-sm"
                        >

                            {/* Employee Header */}
                            <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                    <h3 className="font-semibold text-lg break-words">
                                        {employee.full_name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1 break-all">
                                        {employee.email || "-"}
                                    </p>

                                </div>

                                <div className="shrink-0">

                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            employee.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {employee.status}
                                    </span>

                                </div>

                            </div>

                            {/* Employee Details */}
                            <div className="mt-4 space-y-3 text-sm">

                                <div className="flex justify-between gap-4">

                                    <span className="text-gray-500">
                                        Phone
                                    </span>

                                    <span className="font-medium text-right break-all">
                                        {employee.phone || "-"}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4">

                                    <span className="text-gray-500">
                                        Role
                                    </span>

                                    <span className="font-medium text-right capitalize">
                                        {employee.role || "-"}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4">

                                    <span className="text-gray-500">
                                        Status
                                    </span>

                                    <span className="font-medium text-right capitalize">
                                        {employee.status || "-"}
                                    </span>

                                </div>

                            </div>

                            {/* Mobile Actions */}
                            <div className="mt-4 pt-4 border-t flex gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(employee)
                                    }
                                    title="Edit Employee"
                                    aria-label="Edit Employee"
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                                >
                                    <Pencil size={17} />
                                    <span>Edit</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete?.(employee.id)
                                    }
                                    title="Delete Employee"
                                    aria-label="Delete Employee"
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

export default EmployeesTable;