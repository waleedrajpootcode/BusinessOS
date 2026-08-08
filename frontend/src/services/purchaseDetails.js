import { supabase } from "../lib/supabase";

export async function getPurchaseDetails(id) {

  const { data, error } = await supabase

    .from("purchases")

    .select(`
      *,
      suppliers (
        supplier_name,
        phone,
        email
      ),
      purchase_items (
        *,
        products (
          product_name
        )
      )
    `)

    .eq("id", id)

    .single();

  if (error) {

    console.error(error);

    return null;

  }

  return data;

}