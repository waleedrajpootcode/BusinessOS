import { supabase } from "../lib/supabase";

export async function getProductsForSale() {
  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, price, stock")
    .order("product_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getCustomersForSale() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name")
    .order("full_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}