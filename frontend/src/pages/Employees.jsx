import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import Layout from "../components/dashboard/Layout";
import EmployeesTable from "../components/employees/EmployeesTable";
import {
    deleteEmployee,
    getEmployees,
} from "../services/employees";

function Employees() {

    const [employees, setEmployees] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 10;

    useEffect(() => {
        loadEmployees();
    }, []);

    const filteredEmployees = employees.filter((employee) => {

        const keyword = search.toLowerCase();

        return (
            employee.full_name?.toLowerCase().includes(keyword) ||
            employee.email?.toLowerCase().includes(keyword) ||
            employee.phone?.toLowerCase().includes(keyword)
        );

    });

    const indexOfLastEmployee =
        currentPage * employeesPerPage;

    const indexOfFirstEmployee =
        indexOfLastEmployee - employeesPerPage;

    const currentEmployees =
        filteredEmployees.slice(
            indexOfFirstEmployee,
            indexOfLastEmployee
        );

    const totalPages = Math.ceil(
        filteredEmployees.length / employeesPerPage
    );

    async function loadEmployees() {

        const data = await getEmployees();

        setEmployees(data);

    }

    function handleEdit(employee) {

        setSelectedEmployee(employee);
        setOpenModal(true);

    }

    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) return;

        try {

            await deleteEmployee(id);

            alert("Employee Deleted Successfully");

            loadEmployees();

        } catch (error) {

            alert(error.message);

        }

    }

    return (

        <Layout>

            <div className="p-6">

                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Employees
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage your employees.
                        </p>

                    </div>

                    <Button
                        onClick={() => {
                            setSelectedEmployee(null);
                            setOpenModal(true);
                        }}
                    >
                        + Add Employee
                    </Button>

                </div>

                {/* Search */}
                <div className="mt-8">

                    <input
                        type="text"
                        placeholder="Search Employee..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-96 border rounded-lg p-3"
                    />

                </div>

                {/* Employees Table */}
                <EmployeesTable
                    employees={currentEmployees}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(currentPage - 1)
                        }
                        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                        ◀ Previous
                    </button>

                    <span>
                        Page {currentPage} of {totalPages || 1}
                    </span>

                    <button
                        disabled={
                            currentPage === totalPages ||
                            totalPages === 0
                        }
                        onClick={() =>
                            setCurrentPage(currentPage + 1)
                        }
                        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next ▶
                    </button>

                </div>

                {/* Employee Modal */}
                <Modal
                    isOpen={openModal}
                    onClose={() => {
                        setOpenModal(false);
                        setSelectedEmployee(null);
                    }}
                    title={
                        selectedEmployee
                            ? "Edit Employee"
                            : "Add Employee"
                    }
                >
                    <AddEmployeeModal
                        open={true}
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedEmployee(null);
                        }}
                        onSaved={loadEmployees}
                        employee={selectedEmployee}
                    />
                </Modal>

            </div>

        </Layout>

    );

}

export default Employees;