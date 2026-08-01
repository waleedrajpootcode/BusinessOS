import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseTable from "../components/expenses/ExpenseTable";

import {
    getExpenses,
    deleteExpense,
} from "../services/expenses";

function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);


    useEffect(() => {
        loadExpenses();
    }, []);

    async function loadExpenses() {
        const data = await getExpenses();
        setExpenses(data);
    }

    async function handleDelete(id) {

        const confirmDelete =
            window.confirm(
                "Delete this expense?"
            );

        if (!confirmDelete) return;

        await deleteExpense(id);

        loadExpenses();

    }

    return (
        <div className="p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Expenses
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage business expenses.
                    </p>

                </div>

                <Button
                    onClick={() => {
                        setEditingExpense(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Add Expense
                </Button>

            </div>

            <div className="mt-8">

                <input
                    type="text"
                    placeholder="Search Expenses..."
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

                <ExpenseTable
                    expenses={expenses}
                    onEdit={(expense) => {
                        setEditingExpense(expense);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                />

            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
                title={
                    editingExpense
                        ? "Edit Expense"
                        : "Add Expense"
                }
            >

                <ExpenseForm
                    editData={editingExpense}
                    onSuccess={() => {
                        loadExpenses();
                        setEditingExpense(null);
                        setIsModalOpen(false);
                    }}
                />

            </Modal>

        </div>
    );
}

export default Expenses;