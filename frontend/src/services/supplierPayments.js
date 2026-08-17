import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

/* ===========================
   Get Supplier Payment History
=========================== */

export async function getSupplierPayments(purchaseId) {
  const businessId = await getCurrentBusinessId();

  const purchaseIdNumber = Number(purchaseId);

  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  if (!purchaseIdNumber) {
    throw new Error("Purchase ID is required.");
  }

  const { data, error } = await supabase
    .from("supplier_payments")
    .select(`
      id,
      purchase_id,
      amount,
      payment_method,
      payment_date,
      notes,
      created_at,
      business_id
    `)
    .eq("purchase_id", purchaseIdNumber)
    .eq("business_id", businessId)
    .order("payment_date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Supplier Payments Error:",
      error
    );

    throw error;
  }

  return data || [];
}


/* ===========================
   Add Supplier Payment
=========================== */

export async function addSupplierPayment(payment) {
  const businessId = await getCurrentBusinessId();

  const purchaseId = Number(payment.purchase_id);
  const amount = Number(payment.amount);

  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  if (!purchaseId) {
    throw new Error("Purchase ID is required.");
  }

  if (!amount || amount <= 0) {
    throw new Error("Payment amount must be greater than 0.");
  }

  if (!payment.payment_method) {
    throw new Error("Payment method is required.");
  }

  // Verify purchase belongs to current business
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select("id, business_id, total")
    .eq("id", purchaseId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (purchaseError) {
    console.error(
      "Purchase Ownership Check Error:",
      purchaseError
    );

    throw purchaseError;
  }

  if (!purchase) {
    throw new Error(
      "Purchase does not belong to the current business."
    );
  }

  // Get current payment summary
  const { data: summary, error: summaryError } = await supabase
    .from("supplier_payment_summary")
    .select("purchase_total, total_paid, outstanding")
    .eq("purchase_id", purchaseId)
    .eq("business_id", businessId)
    .maybeSingle();

  if (summaryError) {
    console.error(
      "Supplier Payment Summary Error:",
      summaryError
    );

    throw summaryError;
  }

  const purchaseTotal = Number(
    summary?.purchase_total ?? purchase.total ?? 0
  );

  const totalPaid = Number(
    summary?.total_paid ?? 0
  );

  const outstanding = Math.max(
    purchaseTotal - totalPaid,
    0
  );

  if (outstanding <= 0) {
    throw new Error(
      "This purchase is already fully paid."
    );
  }

  if (amount > outstanding) {
    throw new Error(
      `Payment cannot be greater than outstanding amount: PKR ${outstanding.toLocaleString()}`
    );
  }

  const paymentPayload = {
    purchase_id: purchaseId,
    amount: amount,
    payment_method: payment.payment_method,
    payment_date:
      payment.payment_date ||
      new Date().toISOString(),
    notes: payment.notes || null,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("supplier_payments")
    .insert([paymentPayload])
    .select()
    .single();

  if (error) {
    console.error(
      "Add Supplier Payment Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ===========================
   Get Purchase Payment Summary
=========================== */

export async function getSupplierPaymentSummary(
  purchaseId
) {
  const businessId = await getCurrentBusinessId();

  const purchaseIdNumber = Number(purchaseId);

  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  if (!purchaseIdNumber) {
    throw new Error("Purchase ID is required.");
  }

  const { data, error } = await supabase
    .from("supplier_payment_summary")
    .select(`
      purchase_id,
      invoice_no,
      supplier_id,
      business_id,
      purchase_total,
      total_paid,
      outstanding,
      payment_status
    `)
    .eq("purchase_id", purchaseIdNumber)
    .eq("business_id", businessId)
    .maybeSingle();

  if (error) {
    console.error(
      "Get Supplier Payment Summary Error:",
      error
    );

    throw error;
  }

  return data || null;
}


/* ===========================
   Get All Supplier Payments
=========================== */

export async function getAllSupplierPayments() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const { data, error } = await supabase
    .from("supplier_payments")
    .select(`
      id,
      purchase_id,
      amount,
      payment_method,
      payment_date,
      notes,
      created_at,
      business_id
    `)
    .eq("business_id", businessId)
    .order("payment_date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get All Supplier Payments Error:",
      error
    );

    throw error;
  }

  return data || [];
}


/* ===========================
   Delete Supplier Payment
=========================== */

export async function deleteSupplierPayment(
  paymentId
) {
  const businessId = await getCurrentBusinessId();

  const paymentIdNumber = Number(paymentId);

  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  if (!paymentIdNumber) {
    throw new Error(
      "Payment ID is required."
    );
  }

  const { error } = await supabase
    .from("supplier_payments")
    .delete()
    .eq("id", paymentIdNumber)
    .eq("business_id", businessId);

  if (error) {
    console.error(
      "Delete Supplier Payment Error:",
      error
    );

    throw error;
  }

  return true;
}