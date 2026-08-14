import Layout from "../components/dashboard/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseDetails } from "../services/purchaseDetails";
import { generatePurchasePDF } from "../services/pdfPurchase";
import { useBusiness } from "../context/BusinessContext";

function PurchaseDetails() {
    const { id } = useParams();

    const [purchase, setPurchase] = useState(null);
    const { business } = useBusiness();

    async function downloadPDF() {
        if (!purchase) return;

        try {
            await generatePurchasePDF(
                purchase,
                business
            );
        } catch (error) {
            console.error(
                "Purchase PDF generation error:",
                error
            );

            alert(
                "Unable to generate purchase PDF."
            );
        }
    }

    useEffect(() => {
        async function loadPurchase() {
            try {
                const data = await getPurchaseDetails(id);
                setPurchase(data);
            } catch (error) {
                console.error(
                    "Purchase Details Error:",
                    error
                );
            }
        }

        loadPurchase();
    }, [id]);

    if (!purchase) {
        return (
            <Layout>
                <div className="p-6">
                    Loading...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6">

                {/* Print Area */}
                <div className="print-area max-w-5xl mx-auto bg-white">

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mb-6 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                        >
                            🖨️ Print Invoice
                        </button>

                        <button
                            type="button"
                            onClick={downloadPDF}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
                        >
                            📄 Download PDF
                        </button>
                    </div>

                    {/* Invoice Header */}
                    <div className="invoice-section bg-white rounded-xl shadow border p-8">

                        <div className="flex items-start justify-between gap-8">

                            {/* Business Information */}
                            <div className="flex items-start gap-4">

                                {business?.logo && (
                                    <img
                                        src={business.logo}
                                        alt={
                                            business?.business_name ||
                                            "Business Logo"
                                        }
                                        className="w-20 h-20 object-contain"
                                    />
                                )}

                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {business?.business_name ||
                                            "BusinessOS"}
                                    </h1>

                                    {business?.address && (
                                        <p className="text-gray-500 mt-2">
                                            {business.address}
                                        </p>
                                    )}

                                    {business?.email && (
                                        <p className="text-gray-600 mt-1">
                                            {business.email}
                                        </p>
                                    )}

                                    {business?.phone && (
                                        <p className="text-gray-600 mt-1">
                                            {business.phone}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Invoice Title */}
                            <div className="text-right">

                                <h2 className="text-3xl font-bold">
                                    INVOICE
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Purchase Invoice
                                </p>

                            </div>

                        </div>

                        <hr className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Invoice Number
                                </p>

                                <p className="text-lg font-semibold mt-1">
                                    {purchase.invoice_no}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Supplier
                                </p>

                                <p className="text-lg font-semibold mt-1">
                                    {purchase.suppliers?.supplier_name ||
                                        "Supplier"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Purchase Date
                                </p>

                                <p className="text-lg font-semibold mt-1">
                                    {new Date(
                                        purchase.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <p className="text-lg font-semibold mt-1">
                                    {purchase.status}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Purchase Items */}
                    <div className="invoice-section mt-6 bg-white rounded-xl shadow border overflow-hidden">

                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">
                                Purchase Items
                            </h2>
                        </div>

                        <div className="invoice-table-wrapper overflow-x-auto">

                            <table className="w-full border-collapse">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="p-4 text-left">
                                            Product
                                        </th>

                                        <th className="p-4 text-center">
                                            Qty
                                        </th>

                                        <th className="p-4 text-right">
                                            Price
                                        </th>

                                        <th className="p-4 text-right">
                                            Total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {purchase.purchase_items?.map(
                                        (item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b"
                                            >

                                                <td className="p-4 font-medium">
                                                    {
                                                        item.products
                                                            ?.product_name
                                                    }
                                                </td>

                                                <td className="p-4 text-center">
                                                    {item.quantity}
                                                </td>

                                                <td className="p-4 text-right">
                                                    PKR{" "}
                                                    {Number(
                                                        item.price || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td className="p-4 text-right font-semibold">
                                                    PKR{" "}
                                                    {Number(
                                                        item.total || 0
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Invoice Summary */}
                    <div className="invoice-section mt-6 flex justify-end pb-8">

                        <div className="w-full md:w-96 bg-white rounded-xl shadow border p-6">

                            <h3 className="text-lg font-bold mb-4">
                                Invoice Summary
                            </h3>

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        PKR{" "}
                                        {Number(
                                            purchase.subtotal || 0
                                        ).toLocaleString()}
                                    </strong>
                                </div>

                                <div className="flex justify-between">
                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        PKR{" "}
                                        {Number(
                                            purchase.discount || 0
                                        ).toLocaleString()}
                                    </strong>
                                </div>

                                <div className="flex justify-between">
                                    <span>
                                        Tax
                                    </span>

                                    <strong>
                                        PKR{" "}
                                        {Number(
                                            purchase.tax || 0
                                        ).toLocaleString()}
                                    </strong>
                                </div>

                                <hr />

                                <div className="flex justify-between text-xl font-bold">
                                    <span>
                                        Grand Total
                                    </span>

                                    <span>
                                        PKR{" "}
                                        {Number(
                                            purchase.total || 0
                                        ).toLocaleString()}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </Layout>
    );
}

export default PurchaseDetails;