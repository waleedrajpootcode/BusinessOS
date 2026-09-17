import { supabase } from "../lib/supabase";
import { getSales } from "./sales";

/* ===========================
   Get Invoice
   Uses existing RPC (get_sales_with_payment_summary) which has SECURITY DEFINER
   and works within RLS. Filters client-side for the specific invoice.
=========================== */

export async function getInvoice(invoiceId) {
  try {
    const allSales = await getSales();
    const sale = allSales.find(
  (s) => String(s.id) === String(invoiceId) || s.invoice_no === invoiceId
);

    if (!sale) return null;
    return {
      ...sale,
      customers: { full_name: sale.customers?.full_name || "Walk-in Customer" },
    };
  } catch (error) {
    console.error("Get Invoice Error:", error);
    return null;
  }
}

/* ===========================
   Get Invoice Items
   Note: sale_items table has RLS with no SELECT policy.
   This will fail for direct queries. Returns empty array on error.
=========================== */

export async function getInvoiceItems(saleId) {
  try {
    const { data, error } = await supabase
      .from("sale_items")
      .select(`
        *,
        products (
          product_name,
          sku
        )
      `)
      .eq("sale_id", saleId);

    if (error) {
      console.error("Get Invoice Items Error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Get Invoice Items Error:", error);
    return [];
  }
}