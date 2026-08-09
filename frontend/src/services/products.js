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
export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select();

  console.log("Updated Data:", data);
  console.log("Update Error:", error);

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
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}
export async function getLowStockProducts() {

  const { data, error } = await supabase

    .from("products")

    .select(`
      id,
      product_name,
      stock
    `)

    .lte("stock", 5)

    .order("stock");

  if (error) {

    console.error(error);

    return [];

  }

  return data;
}
export async function getInventory() {

  const { data, error } = await supabase

    .from("products")

    .select("*")

    .order("product_name");

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}
export async function generateInternalBarcode() {
  const { data, error } = await supabase.rpc(
    "generate_internal_barcode"
  );

  if (error) {
    console.error("Barcode Generation Error:", error);
    throw error;
  }

  return data;
}
