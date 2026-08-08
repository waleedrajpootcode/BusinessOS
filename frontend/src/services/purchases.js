import { supabase } from "../lib/supabase";


export async function getProductsForPurchase() {

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
export async function getSuppliersForPurchase() {

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name")
    .order("supplier_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
export async function generatePurchaseNumber() {

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

  return `PUR-${year}${month}${day}-${random}`;

}
export async function savePurchase(purchase) {

  const { data, error } = await supabase

    .from("purchases")

    .insert([purchase])

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}
export async function savePurchaseItems(items) {

  const { data, error } = await supabase

    .from("purchase_items")

    .insert(items)

    .select();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}
export async function increaseStock(
  productId,
  quantity
) {

  // Get Current Stock
  const { data: product, error: fetchError } =
    await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

  if (fetchError) {

    console.error(fetchError);

    throw fetchError;

  }

  const newStock =
    Number(product.stock) + Number(quantity);

  // Update Stock
  const { error: updateError } =
    await supabase
      .from("products")
      .update({
        stock: newStock,
      })
      .eq("id", productId);

  if (updateError) {

    console.error(updateError);

    throw updateError;

  }

}
export async function getPurchases() {

  const { data, error } = await supabase

    .from("purchases")

    .select(`
      *,
      suppliers (
        supplier_name
      )
    `)

    .order("created_at", {
      ascending: false,
    });

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}
export async function deletePurchase(purchaseId) {
  const { data, error } = await supabase.rpc(
    "delete_purchase_safe",
    {
      p_purchase_id: Number(purchaseId),
    }
  );

  if (error) {
    console.error("Delete Purchase Error:", error);
    throw error;
  }

  return data;
}

