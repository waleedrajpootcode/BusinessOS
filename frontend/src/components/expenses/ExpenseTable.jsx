import { Pencil, Trash2 } from "lucide-react";

function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}) {
  return (
    <>
      {/* =========================
          DESKTOP / TABLET TABLE
      ========================== */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[700px]">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Expense
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {expenses.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center p-10 text-gray-500"
                >
                  No Expenses Found
                </td>
              </tr>

            ) : (

              expenses.map((expense) => (

                <tr
                  key={expense.id}
                  className="border-t"
                >

                  <td className="p-4 break-words">
                    {expense.expense_name}
                  </td>

                  <td className="p-4 break-words">
                    {expense.category}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      expense.amount
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {new Date(
                      expense.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(expense)
                        }
                        title="Edit Expense"
                        aria-label="Edit Expense"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(expense.id)
                        }
                        title="Delete Expense"
                        aria-label="Delete Expense"
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
          MOBILE EXPENSE CARDS
      ========================== */}
      <div className="md:hidden w-full space-y-4">

        {expenses.length === 0 ? (

          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
            No Expenses Found
          </div>

        ) : (

          expenses.map((expense) => (

            <div
              key={expense.id}
              className="w-full bg-white border rounded-xl p-4 shadow-sm"
            >

              {/* Expense Header */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                  <p className="text-xs text-gray-500">
                    Expense
                  </p>

                  <h3 className="font-semibold text-lg break-words">
                    {expense.expense_name}
                  </h3>

                </div>

                <div className="shrink-0 text-right">

                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="font-semibold whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      expense.amount
                    ).toLocaleString()}
                  </p>

                </div>

              </div>


              {/* Expense Details */}
              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between gap-4">

                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium text-right break-words">
                    {expense.category || "-"}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-gray-500">
                    Amount
                  </span>

                  <span className="font-semibold text-right whitespace-nowrap">
                    PKR{" "}
                    {Number(
                      expense.amount
                    ).toLocaleString()}
                  </span>

                </div>


                <div className="flex justify-between gap-4">

                  <span className="text-gray-500">
                    Date
                  </span>

                  <span className="font-medium text-right whitespace-nowrap">
                    {new Date(
                      expense.created_at
                    ).toLocaleDateString()}
                  </span>

                </div>

              </div>


              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">

                {/* Edit */}
                <button
                  type="button"
                  onClick={() =>
                    onEdit(expense)
                  }
                  title="Edit Expense"
                  aria-label="Edit Expense"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition"
                >
                  <Pencil size={17} />
                  <span>Edit</span>
                </button>


                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    onDelete(expense.id)
                  }
                  title="Delete Expense"
                  aria-label="Delete Expense"
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

export default ExpenseTable;