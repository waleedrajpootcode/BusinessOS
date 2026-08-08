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
export async function updatePurchase(purchaseId, purchaseData) {

  const { data, error } = await supabase
    .from("purchases")
    .update({
      subtotal: purchaseData.subtotal,
      discount: purchaseData.discount,
      tax: purchaseData.tax,
      total: purchaseData.total,
    })
    .eq("id", purchaseId)
    .select()
    .single();

  if (error) {
    console.error("Update Purchase Error:", error);
    throw error;
  }

  return data;
}
export async function updatePurchaseItem(itemId, itemData) {

  const { data, error } = await supabase
    .from("purchase_items")
    .update({
      quantity: itemData.quantity,
      price: itemData.price,
      total: itemData.total,
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Update Purchase Item Error:", error);
    throw error;
  }

  return data;
}
export async function updatePurchaseItemSafe(
  itemId,
  quantity,
  price
) {
  const { data, error } = await supabase.rpc(
    "update_purchase_item_safe",
    {
      p_item_id: Number(itemId),
      p_new_quantity: Number(quantity),
      p_new_price: Number(price),
    }
  );

  if (error) {
    console.error(
      "Safe Purchase Item Update Error:",
      error
    );

    throw error;
  }

  return data;
}