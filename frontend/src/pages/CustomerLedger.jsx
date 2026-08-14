import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    CreditCard,
    X,
} from "lucide-react";

import Layout from "../components/dashboard/Layout";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { getCustomerPaymentHistory } from "../services/customers";

function CustomerLedger() {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [paymentNotes, setPaymentNotes] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);


    async function loadLedger() {
        try {
            setLoading(true);

            const { data: customerData, error: customerError } =
                await supabase
                    .from("customers")
                    .select("id, full_name, phone, email, address")
                    .eq("id", Number(id))
                    .single();

            if (customerError) {
                throw customerError;
            }

            setCustomer(customerData);

            const { data: ledgerData, error: ledgerError } =
                await supabase
                    .from("customer_payment_summary")
                    .select(`
            sale_id,
            invoice_no,
            customer_id,
            business_id,
            invoice_total,
            total_paid,
            outstanding,
            payment_status
          `)
                    .eq("customer_id", Number(id))
                    .order("sale_id", { ascending: false });

            if (ledgerError) {
                throw ledgerError;
            }

            const currentLedger = ledgerData || [];

setLedger(currentLedger);

const saleIds = currentLedger.map(
    (item) => Number(item.sale_id)
);

const paymentData = await getCustomerPaymentHistory(
    saleIds
);

setPaymentHistory(paymentData);
        } catch (error) {
            console.error("Customer ledger error:", error);
            alert(
                error?.message ||
                "Unable to load customer ledger."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handlePaymentSubmit(e) {
        e.preventDefault();

        if (!selectedSale) {
            alert("Please select a sale.");
            return;
        }

        const amount = Number(paymentAmount);

        if (!amount || amount <= 0) {
            alert("Payment amount must be greater than zero.");
            return;
        }

        const outstanding = Number(
            selectedSale.outstanding || 0
        );

        if (outstanding <= 0) {
            alert("This invoice is already fully paid.");
            return;
        }

        if (amount > outstanding) {
            alert(
                `Payment cannot be greater than outstanding amount: PKR ${outstanding.toLocaleString()}`
            );
            return;
        }

        try {
            setPaymentLoading(true);

            const {
                data: {
                    user,
                },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                throw userError;
            }

            if (!user) {
                throw new Error(
                    "User session not found. Please login again."
                );
            }

            const {
                data: profile,
                error: profileError,
            } = await supabase
                .from("profiles")
                .select("business_id")
                .eq("id", user.id)
                .single();

            if (profileError) {
                throw profileError;
            }

            if (!profile?.business_id) {
                throw new Error(
                    "Business information not found."
                );
            }

            const { error } = await supabase
                .from("customer_payments")
                .insert([
                    {
                        sale_id: Number(selectedSale.sale_id),
                        amount: amount,
                        payment_method: paymentMethod,
                        notes: paymentNotes || null,
                        business_id: profile.business_id,
                    },
                ]);

            if (error) {
                throw error;
            }

            alert(
                `Payment Saved Successfully ✅\n\nInvoice: ${selectedSale.invoice_no}\nAmount: PKR ${amount.toLocaleString()}`
            );

            setPaymentModalOpen(false);
            setSelectedSale(null);
            setPaymentAmount("");
            setPaymentMethod("Cash");
            setPaymentNotes("");

            await loadLedger();
        } catch (error) {
            console.error(
                "Customer payment error:",
                error
            );

            alert(
                error?.message ||
                "Unable to save customer payment."
            );
        } finally {
            setPaymentLoading(false);
        }
    }

    useEffect(() => {
        loadLedger();
    }, [id]);

    const totalSales = ledger.reduce(
        (sum, item) =>
            sum + Number(item.invoice_total || 0),
        0
    );

    const totalPaid = ledger.reduce(
        (sum, item) =>
            sum + Number(item.total_paid || 0),
        0
    );

    const totalOutstanding = ledger.reduce(
        (sum, item) =>
            sum + Number(item.outstanding || 0),
        0
    );

    return (
        <Layout>
            <div className="p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <Link
                            to="/customers"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft size={18} />
                            Back to Customers
                        </Link>

                        <h1 className="text-3xl font-bold">
                            Customer Ledger
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Customer sales, payments and outstanding balance.
                        </p>
                    </div>

                </div>

                {/* Customer Information */}
                {customer && (
                    <div className="bg-white rounded-xl shadow border p-6 mb-8">

                        <h2 className="text-2xl font-bold">
                            {customer.full_name}
                        </h2>

                        <div className="mt-3 text-gray-600 space-y-1">

                            {customer.phone && (
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {customer.phone}
                                </p>
                            )}

                            {customer.email && (
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {customer.email}
                                </p>
                            )}

                            {customer.address && (
                                <p>
                                    <strong>Address:</strong>{" "}
                                    {customer.address}
                                </p>
                            )}

                        </div>

                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-xl shadow border p-6">
                        <p className="text-gray-500">
                            Total Sales
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                            PKR {totalSales.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow border p-6">
                        <p className="text-gray-500">
                            Total Paid
                        </p>

                        <h2 className="text-2xl font-bold text-green-600 mt-2">
                            PKR {totalPaid.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow border p-6">
                        <p className="text-gray-500">
                            Outstanding
                        </p>

                        <h2 className="text-2xl font-bold text-red-600 mt-2">
                            PKR {totalOutstanding.toLocaleString()}
                        </h2>
                    </div>

                </div>

 {/* Ledger */}
<div className="bg-white rounded-xl shadow border overflow-hidden">

    <div className="p-5 border-b">
        <h2 className="text-xl font-bold">
            Udhaar / Sales Ledger
        </h2>
    </div>

    {loading ? (
        <div className="p-10 text-center text-gray-500">
            Loading customer ledger...
        </div>
    ) : ledger.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
            No sales found for this customer.
        </div>
    ) : (
        <div className="overflow-x-auto">

            <table className="w-full">

                <thead className="bg-gray-100">
                    <tr>

                        <th className="p-4 text-left">
                            Invoice
                        </th>

                        <th className="p-4 text-right">
                            Sale
                        </th>

                        <th className="p-4 text-right">
                            Paid
                        </th>

                        <th className="p-4 text-right">
                            Outstanding
                        </th>

                        <th className="p-4 text-center">
                            Status
                        </th>

                        <th className="p-4 text-center">
                            Action
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {ledger.map((item) => {
                        const itemPayments = paymentHistory.filter(
                            (payment) =>
                                Number(payment.sale_id) ===
                                Number(item.sale_id)
                        );

                        return (
                            <React.Fragment key={item.sale_id}>

                                {/* Invoice Row */}
                                <tr className="border-t">

                                    <td className="p-4 font-medium">
                                        {item.invoice_no}
                                    </td>

                                    <td className="p-4 text-right">
                                        PKR{" "}
                                        {Number(
                                            item.invoice_total || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-right text-green-600">
                                        PKR{" "}
                                        {Number(
                                            item.total_paid || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-right text-red-600 font-semibold">
                                        PKR{" "}
                                        {Number(
                                            item.outstanding || 0
                                        ).toLocaleString()}
                                    </td>

                                    <td className="p-4 text-center">

                                        <span
                                            className={
                                                item.payment_status === "Paid"
                                                    ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                                                    : item.payment_status === "Partial"
                                                        ? "px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700"
                                                        : "px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                                            }
                                        >
                                            {item.payment_status}
                                        </span>

                                    </td>

                                    <td className="p-4 text-center">

                                        <div className="flex justify-center gap-2">

                                            <Link
                                                to={`/invoice/${item.sale_id}`}
                                            >
                                                <Button>
                                                    <CreditCard size={16} />
                                                </Button>
                                            </Link>

                                            {Number(item.outstanding || 0) > 0 && (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedSale(item);
                                                        setPaymentAmount("");
                                                        setPaymentMethod("Cash");
                                                        setPaymentNotes("");
                                                        setPaymentModalOpen(true);
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            )}

                                        </div>

                                    </td>

                                </tr>

                                {/* Payment History Row */}
                                {itemPayments.length > 0 && (
                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="px-4 pb-5 pt-0 bg-gray-50"
                                        >

                                            <div className="border rounded-lg bg-white overflow-hidden">

                                                <div className="px-4 py-3 border-b bg-gray-50">
                                                    <h3 className="font-semibold">
                                                        Payment History
                                                    </h3>
                                                </div>

                                                <div className="overflow-x-auto">

                                                    <table className="w-full text-sm">

                                                        <thead>
                                                            <tr className="border-b">

                                                                <th className="p-3 text-left">
                                                                    Date
                                                                </th>

                                                                <th className="p-3 text-right">
                                                                    Amount
                                                                </th>

                                                                <th className="p-3 text-left">
                                                                    Method
                                                                </th>

                                                                <th className="p-3 text-left">
                                                                    Notes
                                                                </th>

                                                            </tr>
                                                        </thead>

                                                        <tbody>

                                                            {itemPayments.map(
                                                                (payment) => (
                                                                    <tr
                                                                        key={payment.id}
                                                                        className="border-t"
                                                                    >

                                                                        <td className="p-3">
                                                                            {payment.payment_date
                                                                                ? new Date(
                                                                                      payment.payment_date
                                                                                  ).toLocaleDateString()
                                                                                : "-"}
                                                                        </td>

                                                                        <td className="p-3 text-right font-medium text-green-600">
                                                                            PKR{" "}
                                                                            {Number(
                                                                                payment.amount || 0
                                                                            ).toLocaleString()}
                                                                        </td>

                                                                        <td className="p-3">
                                                                            {payment.payment_method || "-"}
                                                                        </td>

                                                                        <td className="p-3 text-gray-600">
                                                                            {payment.notes || "-"}
                                                                        </td>

                                                                    </tr>
                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                </div>

                                            </div>

                                        </td>

                                    </tr>
                                )}

                            </React.Fragment>
                        );
                    })}

                </tbody>

            </table>

        </div>
    )}

</div>

                {paymentModalOpen && selectedSale && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                        <div className="w-full max-w-md bg-white rounded-xl shadow-xl">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b">

                                <div>
                                    <h2 className="text-xl font-bold">
                                        Receive Payment
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedSale.invoice_no}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (paymentLoading) return;

                                        setPaymentModalOpen(false);
                                        setSelectedSale(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            {/* Payment Form */}
                            <form
                                onSubmit={handlePaymentSubmit}
                                className="p-5 space-y-4"
                            >

                                <div className="bg-gray-50 border rounded-lg p-4 space-y-2">

                                    <div className="flex justify-between">
                                        <span>Invoice Total</span>

                                        <strong>
                                            PKR{" "}
                                            {Number(
                                                selectedSale.invoice_total || 0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Already Paid</span>

                                        <strong className="text-green-600">
                                            PKR{" "}
                                            {Number(
                                                selectedSale.total_paid || 0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Outstanding</span>

                                        <strong className="text-red-600">
                                            PKR{" "}
                                            {Number(
                                                selectedSale.outstanding || 0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block font-medium mb-2">
                                        Payment Amount
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        max={Number(
                                            selectedSale.outstanding || 0
                                        )}
                                        value={paymentAmount}
                                        onChange={(e) =>
                                            setPaymentAmount(e.target.value)
                                        }
                                        placeholder="Enter payment amount"
                                        className="w-full border rounded-lg p-3"
                                        required
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block font-medium mb-2">
                                        Payment Method
                                    </label>

                                    <select
                                        value={paymentMethod}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="w-full border rounded-lg p-3"
                                    >
                                        <option value="Cash">
                                            Cash
                                        </option>

                                        <option value="Bank">
                                            Bank
                                        </option>

                                        <option value="Card">
                                            Card
                                        </option>

                                        <option value="Online">
                                            Online
                                        </option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block font-medium mb-2">
                                        Notes
                                    </label>

                                    <textarea
                                        value={paymentNotes}
                                        onChange={(e) =>
                                            setPaymentNotes(e.target.value)
                                        }
                                        placeholder="Optional payment note"
                                        rows="3"
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-2">

                                    <button
                                        type="button"
                                        disabled={paymentLoading}
                                        onClick={() => {
                                            setPaymentModalOpen(false);
                                            setSelectedSale(null);
                                        }}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <Button
                                        type="submit"
                                        disabled={paymentLoading}
                                    >
                                        {paymentLoading
                                            ? "Saving..."
                                            : "Save Payment"}
                                    </Button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

            </div>
        </Layout>
    );
}

export default CustomerLedger;