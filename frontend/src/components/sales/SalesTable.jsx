import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

function SalesTable({ sales }) {
    return (
        <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden min-w-0 w-full">

            {/* =========================
                DESKTOP / TABLET TABLE
            ========================= */}

            <div className="hidden md:block w-full overflow-hidden">

                <table className="w-full table-fixed">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="p-4 text-left">
                                Invoice
                            </th>

                            <th className="p-4 text-left">
                                Customer
                            </th>

                            <th className="p-4 text-left">
                                Date
                            </th>

                            <th className="p-4 text-left">
                                Total
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {sales.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center p-10 text-gray-500"
                                >
                                    No Sales Found
                                </td>

                            </tr>

                        ) : (

                            sales.map((sale) => (

                                <tr
                                    key={sale.id}
                                    className="border-t"
                                >

                                    <td className="p-4 font-medium break-words">
                                        {sale.invoice_no}
                                    </td>


                                    <td className="p-4 break-words">
                                        {sale.customers?.full_name || "-"}
                                    </td>


                                    <td className="p-4 whitespace-nowrap">
                                        {new Date(
                                            sale.created_at
                                        ).toLocaleDateString()}
                                    </td>


                                    <td className="p-4 whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            sale.total || 0
                                        ).toLocaleString()}
                                    </td>


                                    <td className="p-4 break-words">
                                        {sale.status || "-"}
                                    </td>


                                    <td className="p-4 text-center">

                                        <Link
                                            to={`/invoice/${sale.id}`}
                                            title="View Invoice"
                                            className="inline-flex items-center justify-center"
                                        >

                                            <button
                                                type="button"
                                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                                            >
                                                <Eye size={18} />
                                            </button>

                                        </Link>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* =========================
                MOBILE SALES CARDS
            ========================= */}

            <div className="block md:hidden">

                {sales.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No Sales Found
                    </div>

                ) : (

                    sales.map((sale) => (

                        <div
                            key={sale.id}
                            className="border-b last:border-b-0 p-4"
                        >

                            {/* Invoice + Status */}

                            <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                    <p className="text-xs text-gray-500">
                                        Invoice
                                    </p>

                                    <p className="font-semibold break-words">
                                        {sale.invoice_no}
                                    </p>

                                </div>


                                <span className="shrink-0 text-sm font-medium break-words">
                                    {sale.status || "-"}
                                </span>

                            </div>


                            {/* Customer */}

                            <div className="mt-4">

                                <p className="text-xs text-gray-500">
                                    Customer
                                </p>

                                <p className="font-medium break-words">
                                    {sale.customers?.full_name || "-"}
                                </p>

                            </div>


                            {/* Sale Information */}

                            <div className="mt-4 grid grid-cols-1 gap-3">

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm text-gray-500">
                                        Date
                                    </span>

                                    <span className="text-sm font-medium text-right">
                                        {new Date(
                                            sale.created_at
                                        ).toLocaleDateString()}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm text-gray-500">
                                        Total
                                    </span>

                                    <span className="font-semibold text-right whitespace-nowrap">
                                        PKR{" "}
                                        {Number(
                                            sale.total || 0
                                        ).toLocaleString()}
                                    </span>

                                </div>

                            </div>


                            {/* Action */}

                            <div className="mt-4">

                                <Link
                                    to={`/invoice/${sale.id}`}
                                    className="block w-full"
                                >

                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium"
                                    >

                                        <Eye size={18} />

                                        View Invoice

                                    </button>

                                </Link>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default SalesTable;