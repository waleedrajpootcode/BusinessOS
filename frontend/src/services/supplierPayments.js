import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

/* ===========================
   Get Supplier Payment History
=========================== */

export async function getSupplierPayments(purchaseId) {
  const { data, error } = await supabase
    .from("supplier_payments")
    .select(`
      id,
      purchase_id,
      amount,
      payment_method,
      payment_date,
      notes,
      created_at
    `)
    .eq("purchase_id", Number(purchaseId))
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

  if (!purchaseId) {
    throw new Error(
      "Purchase ID is required."
    );
  }

  if (!amount || amount <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

  if (!payment.payment_method) {
    throw new Error(
      "Payment method is required."
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
    .eq("purchase_id", Number(purchaseId));

  if (error) {
    console.error(
      "Get Supplier Payment Summary Error:",
      error
    );

    throw error;
  }

  return data?.[0] || null;
}


/* ===========================
   Get All Supplier Payments
=========================== */

export async function getAllSupplierPayments() {
  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("supplier_payments")
    .select(`
      id,
      purchase_id,
      amount,
      payment_method,
      payment_date,
      notes,
      created_at
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

  const { error } = await supabase
    .from("supplier_payments")
    .delete()
    .eq("id", Number(paymentId))
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