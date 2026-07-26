import { supabase } from "../lib/supabase";

export async function getProductsCount() {
  const { count, error } = await supabase
    .from("products")
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
export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([product]);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}