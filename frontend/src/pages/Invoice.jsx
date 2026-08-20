import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateInvoicePDF } from "../services/pdfInvoice";
import { useBusiness } from "../context/BusinessContext";

import Layout from "../components/dashboard/Layout";

import {
    getInvoice,
    getInvoiceItems,
} from "../services/invoice";

function Invoice() {
    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);

    const { business } = useBusiness();

    useEffect(() => {
        loadInvoice();
    }, [id]);

    async function loadInvoice() {
        try {
            const invoiceData = await getInvoice(id);

            if (!invoiceData) return;

            setInvoice(invoiceData);

            const invoiceItems = await getInvoiceItems(id);

            setItems(invoiceItems || []);

            console.log("Invoice:", invoiceData);
            console.log("Items:", invoiceItems);
        } catch (error) {
            console.error("Load Invoice Error:", error);
        }
    }

    async function downloadPDF() {
        if (!invoice) return;

        try {
            await generateInvoicePDF(
                invoice,
                items,
                business
            );
        } catch (error) {
            console.error(
                "PDF generation error:",
                error
            );

            alert(
                "Unable to generate invoice PDF."
            );
        }
    }

    if (!invoice) {
        return (
            <Layout>
                <div className="p-4 sm:p-6">
                    Loading...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full min-w-0 p-4 sm:p-6 print-area">

                {/* =========================
                    ACTION BUTTONS
                ========================= */}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6 print:hidden">

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                    >
                        🖨️ Print Invoice
                    </button>

                    <button
                        type="button"
                        onClick={downloadPDF}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                    >
                        📄 Download PDF
                    </button>

                </div>


                {/* =========================
                    INVOICE HEADER
                ========================= */}

                <div className="w-full min-w-0 bg-white rounded-xl shadow p-4 sm:p-6 print:shadow-none print:rounded-none print:p-3">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        {/* BUSINESS INFORMATION */}

                        <div className="flex items-start gap-4 min-w-0">

                            {business?.logo && (
                                <img
                                    src={business.logo}
                                    alt="Business Logo"
                                    className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-contain"
                                />
                            )}

                            <div className="min-w-0">

                                <h1 className="text-2xl sm:text-3xl font-bold break-words">
                                    {business?.business_name ||
                                        "BusinessOS"}
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Business Management System
                                </p>

                                {business?.address && (
                                    <p className="text-sm text-gray-600 mt-2 break-words">
                                        {business.address}
                                    </p>
                                )}

                                {business?.email && (
                                    <p className="text-sm text-gray-600 break-all">
                                        {business.email}
                                    </p>
                                )}

                                {business?.phone && (
                                    <p className="text-sm text-gray-600 break-words">
                                        {business.phone}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* INVOICE INFORMATION */}

                        <div className="text-left lg:text-right min-w-0">

                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 print:text-black">
                                INVOICE
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Sales Invoice
                            </p>

                            <div className="mt-4 space-y-1 text-sm sm:text-base">

                                <p className="break-words">
                                    <strong>
                                        Invoice Number:
                                    </strong>{" "}
                                    {invoice.invoice_no}
                                </p>

                                <p>
                                    <strong>
                                        Invoice Date:
                                    </strong>{" "}
                                    {new Date(
                                        invoice.created_at
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}
                                    {invoice.status}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="border-t mt-6 pt-4">

                        <p className="text-sm text-gray-500">
                            Thank you for doing business with us.
                        </p>

                    </div>

                </div>


                {/* =========================
                    CUSTOMER INFORMATION
                ========================= */}

                <div className="w-full min-w-0 mt-6 bg-white rounded-xl shadow p-4 sm:p-6 print:mt-2 print:shadow-none print:rounded-none print:p-3">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                        <div className="min-w-0">

                            <p className="text-sm text-gray-500">
                                Bill To
                            </p>

                            <p className="text-lg font-semibold mt-1 break-words">
                                {invoice.customers?.full_name ||
                                    "Walk-in Customer"}
                            </p>

                        </div>


                        {invoice.customers?.phone && (
                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    Customer Phone
                                </p>

                                <p className="text-lg font-semibold mt-1 break-words">
                                    {invoice.customers.phone}
                                </p>

                            </div>
                        )}

                    </div>

                </div>


                {/* =========================
                    SALES ITEMS
                ========================= */}

                <h2 className="text-xl font-bold mt-8 mb-4 print:mt-3 print:mb-2">
                    Sale Items
                </h2>


                {/* DESKTOP TABLE */}

                <div className="hidden md:block w-full min-w-0 bg-white rounded-xl shadow overflow-hidden print:block print:mt-2 print:shadow-none print:rounded-none">

                    <table className="w-full table-fixed">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="p-4 text-left">
                                    Product
                                </th>

                                <th className="p-4 text-center w-20">
                                    Qty
                                </th>

                                <th className="p-4 text-right w-36">
                                    Price
                                </th>

                                <th className="p-4 text-right w-40">
                                    Total
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {items.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b"
                                >

                                    <td className="p-4 font-medium break-words print:p-2">
                                        {item.products?.product_name ||
                                            item.product_name ||
                                            "-"}
                                    </td>


                                    <td className="p-4 text-center print:p-2">
                                        {item.quantity}
                                    </td>


                                    <td className="p-4 text-right font-mono whitespace-nowrap print:p-2">
                                        PKR{" "}
                                        {Number(
                                            item.price || 0
                                        ).toLocaleString()}
                                    </td>


                                    <td className="p-4 text-right font-semibold whitespace-nowrap print:p-2">
                                        PKR{" "}
                                        {Number(
                                            item.total || 0
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* MOBILE CARDS */}

                <div className="block md:hidden space-y-3 print:hidden">

                    {items.map((item, index) => (

                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow border p-4"
                        >

                            <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                    <p className="text-xs text-gray-500">
                                        Item #{index + 1}
                                    </p>

                                    <p className="font-semibold mt-1 break-words">
                                        {item.products?.product_name ||
                                            item.product_name ||
                                            "-"}
                                    </p>

                                </div>

                            </div>


                            <div className="mt-4 grid grid-cols-1 gap-3">

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm text-gray-500">
                                        Quantity
                                    </span>

                                    <span className="font-medium">
                                        {item.quantity}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm text-gray-500">
                                        Price
                                    </span>

                                    <span className="font-mono text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            item.price || 0
                                        ).toLocaleString()}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between gap-3 border-t pt-3">

                                    <span className="text-sm font-medium text-gray-600">
                                        Total
                                    </span>

                                    <span className="font-semibold text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            item.total || 0
                                        ).toLocaleString()}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* =========================
                    INVOICE SUMMARY
                ========================= */}

                <div className="mt-8 flex justify-end pb-8 print:mt-3 print:pb-2">

                    <div className="w-full sm:w-96 max-w-full bg-white rounded-xl shadow p-4 sm:p-6 print:p-3 print:shadow-none print:rounded-none">

                        <div className="flex justify-between gap-4 py-2 print:py-1">

                            <span>
                                Subtotal
                            </span>

                            <span className="text-right whitespace-nowrap">
                                PKR{" "}
                                {Number(
                                    invoice.subtotal || 0
                                ).toLocaleString()}
                            </span>

                        </div>


                        <div className="flex justify-between gap-4 py-2 print:py-1">

                            <span>
                                Discount
                            </span>

                            <span className="text-right whitespace-nowrap">
                                PKR{" "}
                                {Number(
                                    invoice.discount || 0
                                ).toLocaleString()}
                            </span>

                        </div>


                        <div className="flex justify-between gap-4 py-2 print:py-1">

                            <span>
                                Tax
                            </span>

                            <span className="text-right whitespace-nowrap">
                                PKR{" "}
                                {Number(
                                    invoice.tax || 0
                                ).toLocaleString()}
                            </span>

                        </div>


                        <hr className="my-4 print:my-2" />


                        <div className="flex justify-between gap-4 text-lg sm:text-xl font-bold text-blue-600 print:text-black">

                            <span>
                                Grand Total
                            </span>

                            <span className="text-right whitespace-nowrap">
                                PKR{" "}
                                {Number(
                                    invoice.total || 0
                                ).toLocaleString()}
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        </Layout>
    );
}

export default Invoice;