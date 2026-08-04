import { supabase } from "../lib/supabase";

/* ===========================
   Get Invoice
=========================== */

export async function getInvoice(invoiceId) {

  const { data, error } = await supabase

    .from("sales")

    .select(`
      *,
      customers (
        full_name
      )
    `)

    .eq("id", invoiceId)

    .single();

  if (error) {

    console.error(error);

    return null;

  }

  return data;

}

/* ===========================
   Get Invoice Items
=========================== */

export async function getInvoiceItems(saleId) {

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

    console.error(error);

    return [];

  }

  return data;

}
