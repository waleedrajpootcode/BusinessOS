import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { generateInvoicePDF } from "../services/pdfInvoice";

import Layout from "../components/dashboard/Layout";
import Button from "../components/ui/Button";

import {
    getInvoice,
    getInvoiceItems,
} from "../services/invoice";

function Invoice() {

    const { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);

    const invoiceRef = useRef(null);

    useEffect(() => {
        loadInvoice();
    }, []);

    async function loadInvoice() {

        const invoiceData = await getInvoice(id);

        if (!invoiceData) return;

        setInvoice(invoiceData);

        const invoiceItems = await getInvoiceItems(id);

        setItems(invoiceItems);

        console.log("Invoice:", invoiceData);
        console.log("Items:", invoiceItems);

    }

    function downloadPDF() {

        if (!invoice) return;

        generateInvoicePDF(
            invoice,
            items
        );

    }

    return (
        <Layout>

            <div
                ref={invoiceRef}
                className="print-area max-w-5xl mx-auto bg-white rounded-xl shadow border p-8"
            >

                <h1 className="text-3xl font-bold">
                    Sales Invoice
                </h1>

                <p className="text-gray-500 mt-2">
                    Professional Invoice Preview
                </p>

                <hr className="my-8" />

                <div className="grid md:grid-cols-2 gap-8">

                    <div>

                        <h2 className="text-2xl font-bold">

                            BusinessOS Technologies

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Lahore, Punjab, Pakistan

                        </p>

                        <p>

                            support@businessos.pk

                        </p>

                        <p>

                            +92 300 1234567

                        </p>

                    </div>

                    <div className="text-right">
                        <div className="flex justify-end gap-3 mb-4">

                            <Button
                                onClick={() => window.print()}
                            >
                                🖨 Print
                            </Button>

                            <Button
                                onClick={downloadPDF}
                            >
                                📄 Download PDF
                            </Button>

                        </div>

                        <h2 className="text-3xl font-bold">

                            INVOICE

                        </h2>

                        <p className="mt-4">

                            <strong>Invoice No:</strong>

                            {" "}

                            {invoice?.invoice_no}

                        </p>

                        <p>

                            <strong>Date:</strong>

                            {" "}

                            {invoice
                                ? new Date(
                                    invoice.created_at
                                ).toLocaleDateString()
                                : ""}

                        </p>

                        <p>

                            <strong>Status:</strong>

                            {" "}

                            {invoice?.status}

                        </p>

                    </div>

                </div>

                <hr className="my-8" />

                <div>

                    <h3 className="text-lg font-bold mb-2">

                        Bill To

                    </h3>

                    <p className="text-lg">

                        {invoice?.customers?.full_name}

                    </p>

                </div>

                <hr className="my-8" />

                <div className="overflow-x-auto">

                    <table className="w-full border border-gray-200">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">Product</th>

                                <th className="p-3 text-center">Qty</th>

                                <th className="p-3 text-right">Price</th>

                                <th className="p-3 text-right">Cost</th>

                                <th className="p-3 text-right">Profit</th>

                                <th className="p-3 text-right">Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {item.products?.product_name}
                                    </td>

                                    <td className="p-3 text-center">
                                        {item.quantity}
                                    </td>

                                    <td className="p-3 text-right">
                                        PKR {Number(item.price).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-right">
                                        PKR {Number(item.cost_price).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-right text-green-600 font-semibold">
                                        PKR {Number(item.total_profit).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-right font-semibold">
                                        PKR {Number(item.total).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </Layout>
    );
}

export default Invoice;