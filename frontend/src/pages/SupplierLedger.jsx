import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, X } from "lucide-react";

import Layout from "../components/dashboard/Layout";
import Button from "../components/ui/Button";
import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "../services/currentBusiness";

import {
  getSupplierPaymentSummary,
  addSupplierPayment,
} from "../services/supplierPayments";

function SupplierLedger() {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [paymentSummaries, setPaymentSummaries] = useState({});
  const [loading, setLoading] = useState(true);

  // ============================
  // Payment Modal State
  // ============================

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ============================
  // Load Supplier Ledger
  // ============================

  async function loadLedger() {
    try {
      setLoading(true);

      const businessId = await getCurrentBusinessId();

      const supplierId = Number(id);

      if (!supplierId) {
        throw new Error("Invalid supplier ID.");
      }

      const {
        data: supplierData,
        error: supplierError,
      } = await supabase
        .from("suppliers")
        .select(
          "id, supplier_name, phone, email, address"
        )
        .eq("id", supplierId)
        .eq("business_id", businessId)
        .maybeSingle();

      if (supplierError) {
        throw supplierError;
      }

      if (!supplierData) {
        throw new Error(
          "Supplier not found. Please open the ledger from the Suppliers page."
        );
      }

      setSupplier(supplierData);

      const {
        data: ledgerData,
        error: ledgerError,
      } = await supabase
        .from("purchases")
        .select(`
          id,
          invoice_no,
          supplier_id,
          business_id,
          subtotal,
          discount,
          tax,
          total,
          status,
          created_at
        `)
        .eq("supplier_id", supplierId)
        .eq("business_id", businessId)
        .order("id", {
          ascending: false,
        });

      if (ledgerError) {
        throw ledgerError;
      }

      const purchases = ledgerData || [];

      setLedger(purchases);

      const summaries = {};

      await Promise.all(
        purchases.map(async (purchase) => {
          try {
            const summary =
              await getSupplierPaymentSummary(
                purchase.id
              );

            if (summary) {
              summaries[purchase.id] = summary;
            }
          } catch (error) {
            console.error(
              `Payment summary error for purchase ${purchase.id}:`,
              error
            );
          }
        })
      );

      setPaymentSummaries(summaries);

    } catch (error) {
      console.error(
        "Supplier ledger error:",
        error
      );

      alert(
        error?.message ||
          "Unable to load supplier ledger."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================
  // Open Payment Modal
  // ============================

  function openPaymentModal(purchase, outstanding) {
    const purchaseId = Number(purchase?.id);

    if (!purchaseId) {
      alert("Invalid Purchase ID.");
      return;
    }

    if (outstanding <= 0) {
      alert(
        "This purchase is already fully paid."
      );
      return;
    }

    const summary =
      paymentSummaries[purchaseId];

    setSelectedPurchase({
      ...purchase,

      id: purchaseId,

      total_paid: Number(
        summary?.total_paid || 0
      ),

      outstanding: Number(
        outstanding || 0
      ),

      payment_status:
        summary?.payment_status || "Unpaid",
    });

    setPaymentAmount("");
    setPaymentMethod("Cash");
    setPaymentNotes("");
    setPaymentModalOpen(true);
  }

  // ============================
  // Close Payment Modal
  // ============================

  function closePaymentModal() {
    if (paymentLoading) {
      return;
    }

    setPaymentModalOpen(false);
    setSelectedPurchase(null);
    setPaymentAmount("");
    setPaymentMethod("Cash");
    setPaymentNotes("");
  }

  // ============================
  // Submit Supplier Payment
  // ============================

  async function handlePaymentSubmit(e) {
    e.preventDefault();

    if (!selectedPurchase) {
      alert("Please select a purchase.");
      return;
    }

    const purchaseId = Number(
      selectedPurchase.id
    );

    if (!purchaseId) {
      alert("Purchase ID is required.");
      return;
    }

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      alert(
        "Payment amount must be greater than zero."
      );
      return;
    }

    const outstanding = Number(
      selectedPurchase.outstanding || 0
    );

    if (outstanding <= 0) {
      alert(
        "This purchase is already fully paid."
      );
      return;
    }

    if (amount > outstanding) {
      alert(
        `Payment cannot be greater than outstanding amount: PKR ${outstanding.toLocaleString()}`
      );
      return;
    }

    if (!paymentMethod) {
      alert("Payment method is required.");
      return;
    }

    try {
      setPaymentLoading(true);

      await addSupplierPayment({
        purchase_id: purchaseId,
        amount: amount,
        payment_method: paymentMethod,
        notes: paymentNotes || null,
      });

      alert(
        `Payment Saved Successfully ✅\n\nInvoice: ${selectedPurchase.invoice_no}\nAmount: PKR ${amount.toLocaleString()}`
      );

      setPaymentModalOpen(false);
      setSelectedPurchase(null);
      setPaymentAmount("");
      setPaymentMethod("Cash");
      setPaymentNotes("");

      await loadLedger();

    } catch (error) {
      console.error(
        "Supplier payment error:",
        error
      );

      alert(
        error?.message ||
          "Unable to save supplier payment."
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  // ============================
  // Initial Load
  // ============================

  useEffect(() => {
    loadLedger();
  }, [id]);

  // ============================
  // Calculate Overall Summary
  // ============================

  const totalPurchases = ledger.reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

  const totalPaid = ledger.reduce(
    (sum, item) =>
      sum +
      Number(
        paymentSummaries[item.id]
          ?.total_paid || 0
      ),
    0
  );

  const totalOutstanding = Math.max(
    totalPurchases - totalPaid,
    0
  );

  // ============================
  // Status Helper
  // ============================

  function getPaymentStatus(
    purchaseTotal,
    paid,
    summary
  ) {
    if (summary?.payment_status) {
      return summary.payment_status;
    }

    const outstanding = Math.max(
      purchaseTotal - paid,
      0
    );

    if (outstanding <= 0) {
      return "Paid";
    }

    if (paid > 0) {
      return "Partial";
    }

    return "Unpaid";
  }

  function getStatusClasses(status) {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-red-100 text-red-700";
    }
  }

  return (
    <Layout>

      <div className="w-full min-w-0">

        {/* ============================
            Header
        ============================ */}

        <div className="mb-8">

          <Link
            to="/suppliers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={18} />
            <span>Back to Suppliers</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            Supplier Ledger
          </h1>

          <p className="text-gray-500 mt-2 break-words">
            Supplier purchases, payments and outstanding balance.
          </p>

        </div>


        {/* ============================
            Supplier Information
        ============================ */}

        {supplier && (
          <div className="bg-white rounded-xl shadow border p-4 sm:p-6 mb-8 min-w-0">

            <h2 className="text-xl sm:text-2xl font-bold break-words">
              {supplier.supplier_name}
            </h2>

            <div className="mt-3 text-gray-600 space-y-2 min-w-0">

              {supplier.phone && (
                <p className="break-all">
                  <strong>Phone:</strong>{" "}
                  {supplier.phone}
                </p>
              )}

              {supplier.email && (
                <p className="break-all">
                  <strong>Email:</strong>{" "}
                  {supplier.email}
                </p>
              )}

              {supplier.address && (
                <p className="break-words">
                  <strong>Address:</strong>{" "}
                  {supplier.address}
                </p>
              )}

            </div>

          </div>
        )}


        {/* ============================
            Summary Cards
        ============================ */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl shadow border p-5 sm:p-6 min-w-0">

            <p className="text-gray-500">
              Total Purchases
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-2 break-words">
              PKR{" "}
              {totalPurchases.toLocaleString()}
            </h2>

          </div>


          <div className="bg-white rounded-xl shadow border p-5 sm:p-6 min-w-0">

            <p className="text-gray-500">
              Total Paid
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mt-2 break-words">
              PKR{" "}
              {totalPaid.toLocaleString()}
            </h2>

          </div>


          <div className="bg-white rounded-xl shadow border p-5 sm:p-6 min-w-0">

            <p className="text-gray-500">
              Outstanding
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-red-600 mt-2 break-words">
              PKR{" "}
              {totalOutstanding.toLocaleString()}
            </h2>

          </div>

        </div>


        {/* ============================
            Purchase Ledger
        ============================ */}

        <div className="bg-white rounded-xl shadow border overflow-hidden min-w-0">

          <div className="p-4 sm:p-5 border-b">

            <h2 className="text-lg sm:text-xl font-bold">
              Supplier Purchase Ledger
            </h2>

          </div>


          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading supplier ledger...
            </div>

          ) : ledger.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No purchases found for this supplier.
            </div>

          ) : (

            <>

              {/* ============================
                  DESKTOP TABLE
              ============================ */}

              <div className="hidden md:block w-full min-w-0">

                <table className="w-full table-auto">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="p-4 text-left">
                        Invoice
                      </th>

                      <th className="p-4 text-right">
                        Purchase
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

                      const summary =
                        paymentSummaries[item.id];

                      const purchaseTotal =
                        Number(
                          item.total || 0
                        );

                      const paid =
                        Number(
                          summary?.total_paid || 0
                        );

                      const outstanding =
                        Math.max(
                          Number(
                            summary?.outstanding ??
                              purchaseTotal -
                              paid
                          ),
                          0
                        );

                      const paymentStatus =
                        getPaymentStatus(
                          purchaseTotal,
                          paid,
                          summary
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-t hover:bg-gray-50"
                        >

                          <td className="p-4 font-medium">
                            {item.invoice_no}
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            PKR{" "}
                            {purchaseTotal.toLocaleString()}
                          </td>

                          <td className="p-4 text-right text-green-600 whitespace-nowrap">
                            PKR{" "}
                            {paid.toLocaleString()}
                          </td>

                          <td className="p-4 text-right text-red-600 font-semibold whitespace-nowrap">
                            PKR{" "}
                            {outstanding.toLocaleString()}
                          </td>

                          <td className="p-4 text-center">

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusClasses(
                                paymentStatus
                              )}`}
                            >
                              {paymentStatus}
                            </span>

                          </td>

                          <td className="p-4 text-center">

                            <div className="flex justify-center gap-2">

                              <Link
                                to={`/purchases/${item.id}`}
                              >
                                <Button>
                                  <CreditCard
                                    size={16}
                                  />
                                </Button>
                              </Link>

                              {outstanding > 0 && (
                                <Button
                                  type="button"
                                  onClick={() =>
                                    openPaymentModal(
                                      item,
                                      outstanding
                                    )
                                  }
                                >
                                  Pay
                                </Button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>


              {/* ============================
                  MOBILE PURCHASE CARDS
              ============================ */}

              <div className="md:hidden p-4 space-y-4">

                {ledger.map((item) => {

                  const summary =
                    paymentSummaries[item.id];

                  const purchaseTotal =
                    Number(
                      item.total || 0
                    );

                  const paid =
                    Number(
                      summary?.total_paid || 0
                    );

                  const outstanding =
                    Math.max(
                      Number(
                        summary?.outstanding ??
                          purchaseTotal -
                          paid
                      ),
                      0
                    );

                  const paymentStatus =
                    getPaymentStatus(
                      purchaseTotal,
                      paid,
                      summary
                    );

                  return (
                    <div
                      key={item.id}
                      className="w-full border rounded-xl p-4 shadow-sm min-w-0"
                    >

                      {/* Invoice Header */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-xs text-gray-500">
                            Invoice
                          </p>

                          <h3 className="font-semibold text-lg break-words">
                            {item.invoice_no}
                          </h3>

                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses(
                            paymentStatus
                          )}`}
                        >
                          {paymentStatus}
                        </span>

                      </div>


                      {/* Purchase Details */}

                      <div className="mt-4 space-y-3 text-sm">

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-gray-500 shrink-0">
                            Purchase
                          </span>

                          <span className="font-semibold text-right break-words">
                            PKR{" "}
                            {purchaseTotal.toLocaleString()}
                          </span>

                        </div>


                        <div className="flex items-center justify-between gap-4">

                          <span className="text-gray-500 shrink-0">
                            Paid
                          </span>

                          <span className="font-semibold text-green-600 text-right break-words">
                            PKR{" "}
                            {paid.toLocaleString()}
                          </span>

                        </div>


                        <div className="flex items-center justify-between gap-4">

                          <span className="text-gray-500 shrink-0">
                            Outstanding
                          </span>

                          <span className="font-semibold text-red-600 text-right break-words">
                            PKR{" "}
                            {outstanding.toLocaleString()}
                          </span>

                        </div>

                      </div>


                      {/* Mobile Actions */}

                      <div className="mt-4 pt-4 border-t flex gap-2">

                        <Link
                          to={`/purchases/${item.id}`}
                          className="flex-1"
                        >
                          <Button
                            className="w-full flex items-center justify-center"
                          >
                            <CreditCard
                              size={16}
                            />
                            <span className="ml-2">
                              View
                            </span>
                          </Button>
                        </Link>

                        {outstanding > 0 && (
                          <Button
                            type="button"
                            onClick={() =>
                              openPaymentModal(
                                item,
                                outstanding
                              )
                            }
                            className="flex-1"
                          >
                            Pay
                          </Button>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>

            </>

          )}

        </div>


        {/* ============================
            Supplier Payment Modal
        ============================ */}

        {paymentModalOpen &&
          selectedPurchase && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">

              <div className="w-full max-w-md max-h-[95vh] overflow-y-auto bg-white rounded-xl shadow-xl">

                {/* Modal Header */}

                <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b">

                  <div className="min-w-0">

                    <h2 className="text-lg sm:text-xl font-bold">
                      Pay Supplier
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {selectedPurchase.invoice_no}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={closePaymentModal}
                    disabled={paymentLoading}
                    className="shrink-0 text-gray-500 hover:text-gray-800 disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>

                </div>


                {/* Payment Form */}

                <form
                  onSubmit={handlePaymentSubmit}
                  className="p-4 sm:p-5 space-y-4"
                >

                  {/* Purchase Summary */}

                  <div className="bg-gray-50 border rounded-lg p-4 space-y-3">

                    <div className="flex justify-between gap-4">

                      <span className="text-gray-600">
                        Purchase Total
                      </span>

                      <strong className="text-right">
                        PKR{" "}
                        {Number(
                          selectedPurchase.total || 0
                        ).toLocaleString()}
                      </strong>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-600">
                        Already Paid
                      </span>

                      <strong className="text-green-600 text-right">
                        PKR{" "}
                        {Number(
                          selectedPurchase.total_paid ||
                            0
                        ).toLocaleString()}
                      </strong>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-600">
                        Outstanding
                      </span>

                      <strong className="text-red-600 text-right">
                        PKR{" "}
                        {Number(
                          selectedPurchase.outstanding ||
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
                        selectedPurchase.outstanding ||
                          0
                      )}
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(
                          e.target.value
                        )
                      }
                      placeholder="Enter payment amount"
                      className="w-full border rounded-lg p-3"
                      required
                      disabled={paymentLoading}
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
                      className="w-full border rounded-lg p-3"
                      disabled={paymentLoading}
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
                      className="w-full border rounded-lg p-3 resize-none"
                      disabled={paymentLoading}
                    />

                  </div>


                  {/* Buttons */}

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                    <button
                      type="button"
                      disabled={paymentLoading}
                      onClick={closePaymentModal}
                      className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

export default SupplierLedger;