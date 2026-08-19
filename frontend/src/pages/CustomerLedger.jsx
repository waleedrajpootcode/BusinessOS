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

            const {
                data: customerData,
                error: customerError,
            } = await supabase
                .from("customers")
                .select("id, full_name, phone, email, address")
                .eq("id", Number(id))
                .maybeSingle();

            if (customerError) {
                throw customerError;
            }

            setCustomer(customerData);

            const {
                data: ledgerData,
                error: ledgerError,
            } = await supabase
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
                data: { user },
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

    function openPaymentModal(item) {
        setSelectedSale(item);
        setPaymentAmount("");
        setPaymentMethod("Cash");
        setPaymentNotes("");
        setPaymentModalOpen(true);
    }

    function closePaymentModal() {
        if (paymentLoading) {
            return;
        }

        setPaymentModalOpen(false);
        setSelectedSale(null);
    }

    function getStatusClass(status) {
        if (status === "Paid") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Partial") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-red-100 text-red-700";
    }

    return (
        <Layout>
            <div className="w-full min-w-0 p-4 sm:p-6">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/customers"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Customers</span>
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-bold break-words">
                        Customer Ledger
                    </h1>

                    <p className="text-gray-500 mt-2 break-words">
                        Customer sales, payments and outstanding balance.
                    </p>
                </div>

                {/* Customer Information */}
                {customer && (
                    <div className="w-full min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6 mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold break-words">
                            {customer.full_name}
                        </h2>

                        <div className="mt-3 text-gray-600 space-y-1 min-w-0">
                            {customer.phone && (
                                <p className="break-words">
                                    <strong>Phone:</strong>{" "}
                                    {customer.phone}
                                </p>
                            )}

                            {customer.email && (
                                <p className="break-all">
                                    <strong>Email:</strong>{" "}
                                    {customer.email}
                                </p>
                            )}

                            {customer.address && (
                                <p className="break-words">
                                    <strong>Address:</strong>{" "}
                                    {customer.address}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">

                    <div className="min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6">
                        <p className="text-gray-500">
                            Total Sales
                        </p>

                        <h2 className="text-xl sm:text-2xl font-bold mt-2 break-words">
                            PKR {totalSales.toLocaleString()}
                        </h2>
                    </div>

                    <div className="min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6">
                        <p className="text-gray-500">
                            Total Paid
                        </p>

                        <h2 className="text-xl sm:text-2xl font-bold text-green-600 mt-2 break-words">
                            PKR {totalPaid.toLocaleString()}
                        </h2>
                    </div>

                    <div className="min-w-0 bg-white rounded-xl shadow border p-4 sm:p-6">
                        <p className="text-gray-500">
                            Outstanding
                        </p>

                        <h2 className="text-xl sm:text-2xl font-bold text-red-600 mt-2 break-words">
                            PKR {totalOutstanding.toLocaleString()}
                        </h2>
                    </div>

                </div>

                {/* Ledger Container */}
                <div className="w-full min-w-0 bg-white rounded-xl shadow border overflow-hidden">

                    {/* Ledger Header */}
                    <div className="p-4 sm:p-5 border-b">
                        <h2 className="text-lg sm:text-xl font-bold break-words">
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
                        <>
                            {/* ================================================== */}
                            {/* DESKTOP / TABLET */}
                            {/* ================================================== */}

                            <div className="hidden md:block w-full min-w-0">

                                <table className="w-full table-fixed border-collapse">

                                    <colgroup>
                                        <col className="w-[16%]" />
                                        <col className="w-[16%]" />
                                        <col className="w-[16%]" />
                                        <col className="w-[18%]" />
                                        <col className="w-[14%]" />
                                        <col className="w-[20%]" />
                                    </colgroup>

                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 lg:p-4 text-left text-sm lg:text-base">
                                                Invoice
                                            </th>

                                            <th className="p-3 lg:p-4 text-right text-sm lg:text-base">
                                                Sale
                                            </th>

                                            <th className="p-3 lg:p-4 text-right text-sm lg:text-base">
                                                Paid
                                            </th>

                                            <th className="p-3 lg:p-4 text-right text-sm lg:text-base">
                                                Outstanding
                                            </th>

                                            <th className="p-3 lg:p-4 text-center text-sm lg:text-base">
                                                Status
                                            </th>

                                            <th className="p-3 lg:p-4 text-center text-sm lg:text-base">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {ledger.map((item) => {
                                            const itemPayments =
                                                paymentHistory.filter(
                                                    (payment) =>
                                                        Number(
                                                            payment.sale_id
                                                        ) ===
                                                        Number(
                                                            item.sale_id
                                                        )
                                                );

                                            return (
                                                <React.Fragment
                                                    key={item.sale_id}
                                                >

                                                    {/* Invoice Row */}
                                                    <tr className="border-t">

                                                        <td className="p-3 lg:p-4 font-medium break-words">
                                                            {item.invoice_no}
                                                        </td>

                                                        <td className="p-3 lg:p-4 text-right whitespace-nowrap text-sm lg:text-base">
                                                            PKR{" "}
                                                            {Number(
                                                                item.invoice_total ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="p-3 lg:p-4 text-right text-green-600 whitespace-nowrap text-sm lg:text-base">
                                                            PKR{" "}
                                                            {Number(
                                                                item.total_paid ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="p-3 lg:p-4 text-right text-red-600 font-semibold whitespace-nowrap text-sm lg:text-base">
                                                            PKR{" "}
                                                            {Number(
                                                                item.outstanding ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="p-3 lg:p-4 text-center">

                                                            <span
                                                                className={`inline-block px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm whitespace-nowrap ${getStatusClass(
                                                                    item.payment_status
                                                                )}`}
                                                            >
                                                                {
                                                                    item.payment_status
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="p-3 lg:p-4">

                                                            <div className="flex flex-wrap justify-center gap-2">

                                                                <Link
                                                                    to={`/invoice/${item.sale_id}`}
                                                                >
                                                                    <Button>
                                                                        <CreditCard
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </Link>

                                                                {Number(
                                                                    item.outstanding ||
                                                                        0
                                                                ) > 0 && (
                                                                    <Button
                                                                        onClick={() =>
                                                                            openPaymentModal(
                                                                                item
                                                                            )
                                                                        }
                                                                    >
                                                                        Pay
                                                                    </Button>
                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>

                                                    {/* Payment History */}
                                                    {itemPayments.length > 0 && (
                                                        <tr>

                                                            <td
                                                                colSpan={6}
                                                                className="px-3 lg:px-4 pb-5 pt-0 bg-gray-50"
                                                            >

                                                                <div className="border rounded-lg bg-white overflow-hidden">

                                                                    <div className="px-3 lg:px-4 py-3 border-b bg-gray-50">
                                                                        <h3 className="font-semibold text-sm lg:text-base">
                                                                            Payment History
                                                                        </h3>
                                                                    </div>

                                                                    <table className="w-full table-fixed text-sm">

                                                                        <colgroup>
                                                                            <col className="w-[20%]" />
                                                                            <col className="w-[25%]" />
                                                                            <col className="w-[20%]" />
                                                                            <col className="w-[35%]" />
                                                                        </colgroup>

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
                                                                                (
                                                                                    payment
                                                                                ) => (
                                                                                    <tr
                                                                                        key={
                                                                                            payment.id
                                                                                        }
                                                                                        className="border-t"
                                                                                    >

                                                                                        <td className="p-3 break-words">
                                                                                            {payment.payment_date
                                                                                                ? new Date(
                                                                                                      payment.payment_date
                                                                                                  ).toLocaleDateString()
                                                                                                : "-"}
                                                                                        </td>

                                                                                        <td className="p-3 text-right font-medium text-green-600 whitespace-nowrap">
                                                                                            PKR{" "}
                                                                                            {Number(
                                                                                                payment.amount ||
                                                                                                    0
                                                                                            ).toLocaleString()}
                                                                                        </td>

                                                                                        <td className="p-3 break-words">
                                                                                            {payment.payment_method ||
                                                                                                "-"}
                                                                                        </td>

                                                                                        <td className="p-3 text-gray-600 break-words">
                                                                                            {payment.notes ||
                                                                                                "-"}
                                                                                        </td>

                                                                                    </tr>
                                                                                )
                                                                            )}

                                                                        </tbody>

                                                                    </table>

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

                            {/* ================================================== */}
                            {/* MOBILE — NO TABLE / NO HORIZONTAL SCROLL */}
                            {/* ================================================== */}

                            <div className="block md:hidden w-full min-w-0">

                                {ledger.map((item) => {
                                    const itemPayments =
                                        paymentHistory.filter(
                                            (payment) =>
                                                Number(
                                                    payment.sale_id
                                                ) ===
                                                Number(
                                                    item.sale_id
                                                )
                                        );

                                    return (
                                        <div
                                            key={item.sale_id}
                                            className="w-full min-w-0 border-b last:border-b-0 p-4"
                                        >

                                            {/* Invoice Header */}
                                            <div className="w-full min-w-0 flex items-start justify-between gap-3">

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500">
                                                        Invoice
                                                    </p>

                                                    <p className="font-semibold break-words">
                                                        {item.invoice_no}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 max-w-[40%] px-2.5 py-1 rounded-full text-xs ${getStatusClass(
                                                        item.payment_status
                                                    )}`}
                                                >
                                                    <span className="block truncate">
                                                        {
                                                            item.payment_status
                                                        }
                                                    </span>
                                                </span>

                                            </div>

                                            {/* Financial Information */}
                                            <div className="mt-4 w-full min-w-0 space-y-3">

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-sm text-gray-500 shrink-0">
                                                        Sale
                                                    </span>

                                                    <span className="font-medium text-right break-words">
                                                        PKR{" "}
                                                        {Number(
                                                            item.invoice_total ||
                                                                0
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-sm text-gray-500 shrink-0">
                                                        Paid
                                                    </span>

                                                    <span className="font-medium text-green-600 text-right break-words">
                                                        PKR{" "}
                                                        {Number(
                                                            item.total_paid ||
                                                                0
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-sm text-gray-500 shrink-0">
                                                        Outstanding
                                                    </span>

                                                    <span className="font-semibold text-red-600 text-right break-words">
                                                        PKR{" "}
                                                        {Number(
                                                            item.outstanding ||
                                                                0
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>

                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 flex gap-2 w-full">

                                                <Link
                                                    to={`/invoice/${item.sale_id}`}
                                                    className="flex-1 min-w-0"
                                                >
                                                    <Button className="w-full">
                                                        <span className="flex items-center justify-center gap-2">
                                                            <CreditCard
                                                                size={16}
                                                            />
                                                            <span>
                                                                Invoice
                                                            </span>
                                                        </span>
                                                    </Button>
                                                </Link>

                                                {Number(
                                                    item.outstanding || 0
                                                ) > 0 && (
                                                    <Button
                                                        className="flex-1 min-w-0"
                                                        onClick={() =>
                                                            openPaymentModal(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Pay
                                                    </Button>
                                                )}

                                            </div>

                                            {/* Mobile Payment History */}
                                            {itemPayments.length > 0 && (
                                                <div className="mt-4 w-full min-w-0 border rounded-lg bg-gray-50 overflow-hidden">

                                                    <div className="px-3 py-2 border-b">
                                                        <h3 className="font-semibold text-sm">
                                                            Payment History
                                                        </h3>
                                                    </div>

                                                    <div className="p-3 space-y-3">

                                                        {itemPayments.map(
                                                            (payment) => (
                                                                <div
                                                                    key={
                                                                        payment.id
                                                                    }
                                                                    className="w-full min-w-0 bg-white border rounded-lg p-3"
                                                                >

                                                                    <div className="flex items-start justify-between gap-3">

                                                                        <div className="min-w-0">
                                                                            <p className="text-xs text-gray-500">
                                                                                Date
                                                                            </p>

                                                                            <p className="text-sm font-medium break-words">
                                                                                {payment.payment_date
                                                                                    ? new Date(
                                                                                          payment.payment_date
                                                                                      ).toLocaleDateString()
                                                                                    : "-"}
                                                                            </p>
                                                                        </div>

                                                                        <div className="min-w-0 text-right">
                                                                            <p className="text-xs text-gray-500">
                                                                                Amount
                                                                            </p>

                                                                            <p className="text-sm font-semibold text-green-600 break-words">
                                                                                PKR{" "}
                                                                                {Number(
                                                                                    payment.amount ||
                                                                                        0
                                                                                ).toLocaleString()}
                                                                            </p>
                                                                        </div>

                                                                    </div>

                                                                    <div className="mt-3">
                                                                        <p className="text-xs text-gray-500">
                                                                            Method
                                                                        </p>

                                                                        <p className="text-sm break-words">
                                                                            {payment.payment_method ||
                                                                                "-"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="mt-3">
                                                                        <p className="text-xs text-gray-500">
                                                                            Notes
                                                                        </p>

                                                                        <p className="text-sm text-gray-600 break-words">
                                                                            {payment.notes ||
                                                                                "-"}
                                                                        </p>
                                                                    </div>

                                                                </div>
                                                            )
                                                        )}

                                                    </div>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>
                        </>
                    )}

                </div>

                {/* ================================================== */}
                {/* PAYMENT MODAL */}
                {/* ================================================== */}

                {paymentModalOpen && selectedSale && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">

                        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b">

                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold">
                                        Receive Payment
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1 break-words">
                                        {selectedSale.invoice_no}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="shrink-0 text-gray-500 hover:text-gray-800 p-1"
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            {/* Payment Form */}
                            <form
                                onSubmit={handlePaymentSubmit}
                                className="p-4 sm:p-5 space-y-4"
                            >

                                {/* Invoice Summary */}
                                <div className="bg-gray-50 border rounded-lg p-4 space-y-3">

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm">
                                            Invoice Total
                                        </span>

                                        <strong className="text-right break-words">
                                            PKR{" "}
                                            {Number(
                                                selectedSale.invoice_total ||
                                                    0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm">
                                            Already Paid
                                        </span>

                                        <strong className="text-green-600 text-right break-words">
                                            PKR{" "}
                                            {Number(
                                                selectedSale.total_paid ||
                                                    0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm">
                                            Outstanding
                                        </span>

                                        <strong className="text-red-600 text-right break-words">
                                            PKR{" "}
                                            {Number(
                                                selectedSale.outstanding ||
                                                    0
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                </div>

                                {/* Payment Amount */}
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
                                            setPaymentAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter payment amount"
                                        className="w-full min-w-0 border rounded-lg p-3"
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
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        className="w-full min-w-0 border rounded-lg p-3"
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
                                            setPaymentNotes(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Optional payment note"
                                        rows="3"
                                        className="w-full min-w-0 border rounded-lg p-3 resize-y"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                                    <button
                                        type="button"
                                        disabled={paymentLoading}
                                        onClick={closePaymentModal}
                                        className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <Button
                                        type="submit"
                                        disabled={paymentLoading}
                                        className="w-full sm:w-auto"
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