import { Pencil, Trash2 } from "lucide-react";

function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full">

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

              <td className="p-4">
                {expense.expense_name}
              </td>

              <td className="p-4">
                {expense.category}
              </td>

              <td className="p-4">
                PKR {Number(expense.amount).toLocaleString()}
              </td>

              <td className="p-4">
                {new Date(
                  expense.created_at
                ).toLocaleDateString()}
              </td>

              <td className="p-4">

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit(expense)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(expense.id)}
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

export default ExpenseTable;