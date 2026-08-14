import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addCustomer(customer) {
  const businessId = await getCurrentBusinessId();

  const customerPayload = {
    ...customer,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("customers")
    .insert([customerPayload])
    .select();

  if (error) {
    console.error("Add Customer Error:", error);
    throw error;
  }

  return data;
}

export async function updateCustomer(id, customer) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getCustomersCount() {
  const { count, error } = await supabase
    .from("customers")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(error);
    return 0;
  }

  return count;
}
export async function getCustomerCreditSummary(customerId) {
  const { data, error } = await supabase
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
    .eq("customer_id", Number(customerId))
    .order("sale_id", { ascending: false });

  if (error) {
    console.error("Customer credit summary error:", error);
    throw error;
  }

  return data || [];
}
export async function getCustomerPaymentHistory(saleIds) {
  if (!saleIds || saleIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("customer_payments")
    .select(`
      id,
      sale_id,
      amount,
      payment_method,
      payment_date,
      notes,
      created_at
    `)
    .in("sale_id", saleIds)
    .order("payment_date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("Customer payment history error:", error);
    throw error;
  }

  return data || [];
}