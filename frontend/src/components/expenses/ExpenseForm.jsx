import { useState } from "react";
import Button from "../ui/Button";
import {
  saveExpense,
  updateExpense,
} from "../../services/expenses";
function ExpenseForm({
  onSuccess,
  editData = null,
}) {

  const [expenseName, setExpenseName] = useState(
  editData?.expense_name || ""
);

const [category, setCategory] = useState(
  editData?.category || ""
);

const [amount, setAmount] = useState(
  editData?.amount || ""
);

const [notes, setNotes] = useState(
  editData?.notes || ""
);
  async function handleSubmit(e) {
    e.preventDefault();

    if (!expenseName) {
      alert("Please enter expense name.");
      return;
    }

    if (!category) {
      alert("Please select category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return;
    }

    try {

      if (editData) {

  await updateExpense(
    editData.id,
    {
      expense_name: expenseName,
      category,
      amount: Number(amount),
      notes,
    }
  );

} else {

  await saveExpense({
    expense_name: expenseName,
    category,
    amount: Number(amount),
    notes,
  });

}

      setExpenseName("");
      setCategory("");
      setAmount("");
      setNotes("");

      alert("Expense saved successfully!");

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="text"
        placeholder="Expense Name"
        value={expenseName}
        onChange={(e) =>
          setExpenseName(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="">
          Select Category
        </option>

        <option>Rent</option>
        <option>Salary</option>
        <option>Electricity</option>
        <option>Internet</option>
        <option>Fuel</option>
        <option>Packaging</option>
        <option>Miscellaneous</option>

      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex justify-end">

        <Button type="submit">
          {editData 
          ? "Update Expense" 
          : "Save Expense"}
        </Button>

      </div>

    </form>
  );
}

export default ExpenseForm;