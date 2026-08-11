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

            const data = await getPurchaseDetails(id);

            setPurchase(data);

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

            <div className="p-6 print-area print:p-3">

                <div className="flex justify-end mb-6 print:mb-2">
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

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <h1 className="text-3xl font-bold">
                                RRAW Business OS
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Business Management System
                            </p>
                        </div>

                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-blue-600">
                                INVOICE
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Purchase Invoice
                            </p>
                        </div>

                    </div>

                    <div className="border-t mt-6 pt-4">

                        <p className="text-sm text-gray-500">
                            Thank you for doing business with us.
                        </p>

                    </div>

                </div>

                <div className="mt-6 bg-white rounded-xl shadow p-6 print:mt-2 print:p-3">

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
                                {purchase.suppliers?.supplier_name}
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

                            <div className="mt-2">
                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                                    {purchase.status}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

                <h2 className="text-xl font-bold mt-8 mb-4 print:mt-3 print:mb-2">
                    Purchase Items
                </h2>

                <div className="mt-8 bg-white rounded-xl shadow overflow-hidden print:mt-2">

                    <table className="w-full">

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

                            {purchase.purchase_items?.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >

                                    <td className="p-4 font-medium print:p-2">

                                        {item.products?.product_name}

                                    </td>

                                    <td className="p-4 text-center print:p-2">

                                        {item.quantity}

                                    </td>

                                    <td className="p-4 text-right font-mono print:p-2">
                                        PKR {Number(item.price).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-right font-semibold print:p-2">
                                        PKR {Number(item.total).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="mt-8 flex justify-end pb-8 print:mt-3 print:pb-2">


                    <div className="w-96 bg-white rounded-xl shadow p-6 print:p-3">

                        <div className="flex justify-between py-2 print:py-1">

                            <span>Subtotal</span>

                            <span>

                                PKR {Number(purchase.subtotal).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between py-2 print:py-1">

                            <span>Discount</span>

                            <span>

                                PKR {Number(purchase.discount).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between py-2 print:py-1">

                            <span>Tax</span>

                            <span>

                                PKR {Number(purchase.tax).toLocaleString()}

                            </span>

                        </div>

                        <hr className="my-4 print:my-2" />

                        <div className="flex justify-between text-xl font-bold text-blue-600 print:text-black">

                            <span>Grand Total</span>

                            <span>

                                PKR {Number(purchase.total).toLocaleString()}

                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default PurchaseDetails;