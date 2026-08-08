import Layout from "../components/dashboard/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPurchaseDetails } from "../services/purchaseDetails";

function PurchaseDetails() {
    const { id } = useParams();

    const [purchase, setPurchase] = useState(null);

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

            <div className="p-6">

                <div className="mt-6 bg-white rounded-xl shadow p-6">

                    <div className="grid grid-cols-2 gap-6">

                        <div>

                            <p className="text-gray-500">
                                Invoice Number
                            </p>

                            <h2 className="font-semibold text-lg">
                                {purchase.invoice_no}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Supplier
                            </p>

                            <h2 className="font-semibold text-lg">
                                {purchase.suppliers?.supplier_name}
                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Purchase Date
                            </p>

                            <h2 className="font-semibold text-lg">

                                {new Date(
                                    purchase.created_at
                                ).toLocaleDateString()}

                            </h2>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Status
                            </p>

                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                                {purchase.status}

                            </span>

                        </div>

                    </div>

                </div>

                <h2 className="text-xl font-bold mt-8 mb-4">
                    Purchase Items
                </h2>

                <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">

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

                                    <td className="p-4 font-medium">

                                        {item.products?.product_name}

                                    </td>

                                    <td className="p-4 text-center">

                                        {item.quantity}

                                    </td>

                                    <td className="p-4 text-right font-mono">
                                        PKR {Number(item.price).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-right font-semibold">
                                        PKR {Number(item.total).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="mt-8 flex justify-end">


                    <div className="w-96 bg-white rounded-xl shadow p-6">

                        <div className="flex justify-between py-2">

                            <span>Subtotal</span>

                            <span>

                                PKR {Number(purchase.subtotal).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between py-2">

                            <span>Discount</span>

                            <span>

                                PKR {Number(purchase.discount).toLocaleString()}

                            </span>

                        </div>

                        <div className="flex justify-between py-2">

                            <span>Tax</span>

                            <span>

                                PKR {Number(purchase.tax).toLocaleString()}

                            </span>

                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-xl font-bold text-blue-600">

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