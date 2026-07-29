import Button from "../components/ui/Button";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import SaleForm from "../components/sales/SaleForm";


function Sales() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Sales
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage all sales and invoices.
                    </p>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                >
                    + New Sale
                </Button>

            </div>

            {/* Search */}
            <div className="mt-8">
                <input
                    type="text"
                    placeholder="Search Sales..."
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Table */}
            <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>
                            <th className="p-4 text-left">Invoice</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td
                                colSpan="6"
                                className="text-center p-10 text-gray-500"
                            >
                                No Sales Found
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Sale"
            >
                <SaleForm />

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </Button>
                </div>

            </Modal>

        </div>
    );
}

export default Sales;