import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SaleForm from "../components/sales/SaleForm";
import SalesTable from "../components/sales/SalesTable";

import {
    getSales,
} from "../services/sales";

function Sales() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    async function loadSales() {
        try {
            const data = await getSales();

            setSales(data || []);
        } catch (error) {
            console.error("Load Sales Error:", error);
        }
    }

    useEffect(() => {
        loadSales();
    }, []);

    const filteredSales = sales.filter((sale) => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return true;
        }

        const invoiceNumber = String(
            sale.invoice_no || ""
        ).toLowerCase();

        const customerName = String(
            sale.customers?.full_name || ""
        ).toLowerCase();

        return (
            invoiceNumber.includes(search) ||
            customerName.includes(search)
        );
    });

    return (
        <div className="p-4 sm:p-6 min-w-0">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold">
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
            <div className="mt-6 sm:mt-8">

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    placeholder="Search by invoice or customer..."
                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            {/* Search Result Info */}
            {searchTerm.trim() && (
                <p className="mt-3 text-sm text-gray-500">
                    Showing {filteredSales.length} of {sales.length} sales
                </p>
            )}

            {/* Table */}
            <SalesTable
                sales={filteredSales}
            />

            {/* New Sale Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Sale"
            >

                <SaleForm
                    onSuccess={() => {

                        setIsModalOpen(false);

                        loadSales();

                        setSearchTerm("");

                    }}
                />

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