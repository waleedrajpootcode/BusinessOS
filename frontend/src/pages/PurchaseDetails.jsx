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
                <div className="w-full min-w-0 p-4 sm:p-6">
                    Loading...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="w-full min-w-0 p-4 sm:p-6">

                {/* =========================
                    PRINT AREA
                ========================= */}

                <div className="print-area w-full max-w-5xl mx-auto min-w-0">

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

                    <div className="invoice-section w-full min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6 lg:p-8">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                            {/* BUSINESS INFORMATION */}

                            <div className="flex items-start gap-4 min-w-0">

                                {business?.logo && (
                                    <img
                                        src={business.logo}
                                        alt={
                                            business?.business_name ||
                                            "Business Logo"
                                        }
                                        className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-contain"
                                    />
                                )}

                                <div className="min-w-0">

                                    <h1 className="text-2xl sm:text-3xl font-bold break-words">
                                        {business?.business_name ||
                                            "BusinessOS"}
                                    </h1>

                                    {business?.address && (
                                        <p className="text-gray-500 mt-2 break-words">
                                            {business.address}
                                        </p>
                                    )}

                                    {business?.email && (
                                        <p className="text-gray-600 mt-1 break-all">
                                            {business.email}
                                        </p>
                                    )}

                                    {business?.phone && (
                                        <p className="text-gray-600 mt-1 break-words">
                                            {business.phone}
                                        </p>
                                    )}

                                </div>

                            </div>


                            {/* INVOICE TITLE */}

                            <div className="text-left lg:text-right min-w-0">

                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    INVOICE
                                </h2>

                                <p className="text-gray-500 mt-2 break-words">
                                    Purchase Invoice
                                </p>

                            </div>

                        </div>


                        <hr className="my-6" />


                        {/* INVOICE INFORMATION */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    Invoice Number
                                </p>

                                <p className="text-lg font-semibold mt-1 break-all">
                                    {purchase.invoice_no || "-"}
                                </p>

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    Supplier
                                </p>

                                <p className="text-lg font-semibold mt-1 break-words">
                                    {purchase.suppliers?.supplier_name ||
                                        "Supplier"}
                                </p>

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    Purchase Date
                                </p>

                                <p className="text-lg font-semibold mt-1">
                                    {new Date(
                                        purchase.created_at
                                    ).toLocaleDateString()}
                                </p>

                            </div>


                            <div className="min-w-0">

                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <p className="text-lg font-semibold mt-1 break-words">
                                    {purchase.status || "-"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        PURCHASE ITEMS
                    ========================= */}

                    <div className="invoice-section mt-6 w-full min-w-0 bg-white rounded-xl shadow border overflow-hidden">

                        <div className="p-4 sm:p-6 border-b">

                            <h2 className="text-xl font-bold">
                                Purchase Items
                            </h2>

                        </div>


                        {/* DESKTOP TABLE */}

                        <div className="hidden md:block w-full min-w-0">

                            <table className="w-full table-fixed">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="p-4 text-left">
                                            Product
                                        </th>

                                        <th className="p-4 text-center w-24">
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

                                    {purchase.purchase_items?.map(
                                        (item) => (

                                            <tr
                                                key={item.id}
                                                className="border-b"
                                            >

                                                <td className="p-4 font-medium break-words">
                                                    {item.products
                                                        ?.product_name ||
                                                        "-"}
                                                </td>


                                                <td className="p-4 text-center">
                                                    {item.quantity}
                                                </td>


                                                <td className="p-4 text-right whitespace-nowrap">
                                                    PKR{" "}
                                                    {Number(
                                                        item.price || 0
                                                    ).toLocaleString()}
                                                </td>


                                                <td className="p-4 text-right font-semibold whitespace-nowrap">
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


                        {/* MOBILE CARDS */}

                        <div className="md:hidden p-4 space-y-3">

                            {purchase.purchase_items?.length === 0 ? (

                                <div className="text-center text-gray-500 py-6">
                                    No Purchase Items Found
                                </div>

                            ) : (

                                purchase.purchase_items?.map(
                                    (item, index) => (

                                        <div
                                            key={item.id}
                                            className="w-full min-w-0 bg-white border rounded-xl p-4 shadow-sm"
                                        >

                                            {/* Product */}

                                            <div className="min-w-0">

                                                <p className="text-xs text-gray-500">
                                                    Item #{index + 1}
                                                </p>

                                                <p className="font-semibold mt-1 break-words">
                                                    {item.products
                                                        ?.product_name ||
                                                        "-"}
                                                </p>

                                            </div>


                                            {/* Details */}

                                            <div className="mt-4 space-y-3">

                                                <div className="flex items-center justify-between gap-4">

                                                    <span className="text-sm text-gray-500">
                                                        Quantity
                                                    </span>

                                                    <span className="font-medium text-right">
                                                        {item.quantity}
                                                    </span>

                                                </div>


                                                <div className="flex items-center justify-between gap-4">

                                                    <span className="text-sm text-gray-500">
                                                        Price
                                                    </span>

                                                    <span className="font-medium text-right whitespace-nowrap">
                                                        PKR{" "}
                                                        {Number(
                                                            item.price || 0
                                                        ).toLocaleString()}
                                                    </span>

                                                </div>


                                                <div className="flex items-center justify-between gap-4 border-t pt-3">

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

                                    )
                                )

                            )}

                        </div>

                    </div>


                    {/* =========================
                        INVOICE SUMMARY
                    ========================= */}

                    <div className="invoice-section mt-6 flex justify-end pb-8">

                        <div className="w-full sm:w-96 max-w-full bg-white rounded-xl shadow border p-4 sm:p-6">

                            <h3 className="text-lg font-bold mb-4">
                                Invoice Summary
                            </h3>


                            <div className="space-y-3">

                                <div className="flex justify-between gap-4">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong className="text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            purchase.subtotal || 0
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <div className="flex justify-between gap-4">

                                    <span>
                                        Discount
                                    </span>

                                    <strong className="text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            purchase.discount || 0
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <div className="flex justify-between gap-4">

                                    <span>
                                        Tax
                                    </span>

                                    <strong className="text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            purchase.tax || 0
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <hr />


                                <div className="flex justify-between gap-4 text-lg sm:text-xl font-bold">

                                    <span>
                                        Grand Total
                                    </span>

                                    <span className="text-right whitespace-nowrap">
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