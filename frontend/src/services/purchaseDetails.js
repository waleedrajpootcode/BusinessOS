import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";


/* ============================
   Get Purchase Details
============================ */

export async function getPurchaseDetails(id) {
  const businessId = await getCurrentBusinessId();

  const purchaseId = Number(id);

  if (!purchaseId) {
    throw new Error("Purchase ID is required.");
  }

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
    .eq("id", purchaseId)
    .eq("business_id", businessId)
    .single();

  if (error) {
    console.error(
      "Get Purchase Details Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ============================
   Update Purchase
============================ */

export async function updatePurchase(
  purchaseId,
  purchaseData
) {
  const businessId = await getCurrentBusinessId();

  const purchaseIdNumber = Number(purchaseId);

  if (!purchaseIdNumber) {
    throw new Error(
      "Purchase ID is required."
    );
  }

  const { data, error } = await supabase
    .from("purchases")
    .update({
      subtotal: Number(
        purchaseData.subtotal || 0
      ),
      discount: Number(
        purchaseData.discount || 0
      ),
      tax: Number(
        purchaseData.tax || 0
      ),
      total: Number(
        purchaseData.total || 0
      ),
    })
    .eq("id", purchaseIdNumber)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error(
      "Update Purchase Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ============================
   Update Purchase Item
   Legacy / Direct Update
============================ */

export async function updatePurchaseItem(
  itemId,
  itemData
) {
  const businessId = await getCurrentBusinessId();

  const itemIdNumber = Number(itemId);

  if (!itemIdNumber) {
    throw new Error(
      "Purchase Item ID is required."
    );
  }

  /*
    First verify that the purchase item
    belongs to the current business.
  */

  const { data: item, error: itemError } =
    await supabase
      .from("purchase_items")
      .select(`
        id,
        purchase_id,
        purchases (
          business_id
        )
      `)
      .eq("id", itemIdNumber)
      .maybeSingle();

  if (itemError) {
    console.error(
      "Purchase Item Ownership Error:",
      itemError
    );

    throw itemError;
  }

  if (
    !item ||
    item.purchases?.business_id !== businessId
  ) {
    throw new Error(
      "Purchase item does not belong to the current business."
    );
  }

  const quantity = Number(
    itemData.quantity
  );

  const price = Number(
    itemData.price
  );

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      "Quantity must be greater than zero."
    );
  }

  if (
    !Number.isFinite(price) ||
    price < 0
  ) {
    throw new Error(
      "Price cannot be negative."
    );
  }

  const total = quantity * price;

  const { data, error } = await supabase
    .from("purchase_items")
    .update({
      quantity,
      price,
      total,
    })
    .eq("id", itemIdNumber)
    .select()
    .single();

  if (error) {
    console.error(
      "Update Purchase Item Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ============================
   Safe Purchase Item Update
   Updates Stock + Quantity +
   Price + Total
============================ */

export async function updatePurchaseItemSafe(
  itemId,
  quantity,
  price
) {
  const businessId =
    await getCurrentBusinessId();

  const itemIdNumber = Number(itemId);
  const quantityNumber = Number(quantity);
  const priceNumber = Number(price);

  if (!itemIdNumber) {
    throw new Error(
      "Purchase Item ID is required."
    );
  }

  if (
    !Number.isFinite(quantityNumber) ||
    quantityNumber <= 0
  ) {
    throw new Error(
      "Quantity must be greater than zero."
    );
  }

  if (
    !Number.isFinite(priceNumber) ||
    priceNumber < 0
  ) {
    throw new Error(
      "Price cannot be negative."
    );
  }

  /*
    Verify purchase item belongs to
    current business before calling RPC.
  */

  const { data: item, error: itemError } =
    await supabase
      .from("purchase_items")
      .select(`
        id,
        purchase_id,
        purchases (
          business_id
        )
      `)
      .eq("id", itemIdNumber)
      .maybeSingle();

  if (itemError) {
    console.error(
      "Safe Purchase Item Ownership Error:",
      itemError
    );

    throw itemError;
  }

  if (
    !item ||
    item.purchases?.business_id !== businessId
  ) {
    throw new Error(
      "Purchase item does not belong to the current business."
    );
  }

  const { data, error } =
    await supabase.rpc(
      "update_purchase_item_safe",
      {
        p_item_id: itemIdNumber,
        p_new_quantity: quantityNumber,
        p_new_price: priceNumber,
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