import { supabase } from "../lib/supabase";

export async function getProductsForSale() {
  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, cost_price, price, stock")
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
export async function generateInvoiceNumber() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `INV-${year}${month}${day}-${random}`;
}
export async function saveSale(sale) {

  const { data, error } = await supabase

    .from("sales")

    .insert([sale])

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}
export async function saveSaleItems(items) {

  const { data, error } = await supabase

    .from("sale_items")

    .insert(items)

    .select();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}
export async function updateProductStock(productId, quantity) {

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw fetchError;
  }

  const newStock = product.stock - quantity;

  if (newStock < 0) {
    throw new Error("Not enough stock available.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      stock: newStock,
    })
    .eq("id", productId)
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
export async function getSales() {

  const { data, error } = await supabase

    .from("sales")

    .select(`
      *,
      customers (
        full_name
      )
    `)

    .order("id", {
      ascending: false,
    });

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}
export async function getSalesCount() {

  const { count, error } = await supabase
    .from("sales")
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
export async function getRevenue() {

  const { data, error } = await supabase

    .from("sales")

    .select("total");

  if (error) {

    console.error(error);

    return 0;

  }

  const revenue = data.reduce(
    (sum, sale) => sum + Number(sale.total),
    0
  );

  return revenue;

}
export async function getRecentSales() {

  const { data, error } = await supabase

    .from("sales")

    .select(`
      id,
      invoice_no,
      total,
      created_at,
      customers(full_name)
    `)

    .order("created_at", {
      ascending: false,
    })

    .limit(5);

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}