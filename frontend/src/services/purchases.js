import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

/* ============================
   Get Products For Purchase
============================ */

export async function getProductsForPurchase() {
  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      product_name,
      cost_price,
      price,
      stock,
      product_units!product_units_business_product_fk (
        unit_type,
        base_unit,
        selling_unit,
        conversion_factor,
        is_default
      )
    `)
    .eq("business_id", businessId)
    .order("product_name");

  if (error) {
    console.error(
      "Get Products For Purchase Error:",
      error
    );

    throw error;
  }

  return (data || []).map((product) => {
    const unit = product.product_units?.[0] || null;

    return {
      ...product,

      unit_type: unit?.unit_type || "piece",
      base_unit: unit?.base_unit || "pcs",
      selling_unit: unit?.selling_unit || "pcs",
      conversion_factor:
        Number(unit?.conversion_factor) || 1,

      is_weight:
        unit?.unit_type === "weight",

      is_volume:
        unit?.unit_type === "volume",

      is_length:
        unit?.unit_type === "length",

      is_piece:
        !unit || unit?.unit_type === "piece",
    };
  });
}


/* ============================
   Get Suppliers For Purchase
============================ */

export async function getSuppliersForPurchase() {
  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name")
    .eq("business_id", businessId)
    .order("supplier_name");

  if (error) {
    console.error(
      "Get Suppliers For Purchase Error:",
      error
    );

    throw error;
  }

  return data || [];
}


/* ============================
   Generate Purchase Number
============================ */

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


/* ============================
   Save Purchase
============================ */

export async function savePurchase(purchase) {
  const businessId = await getCurrentBusinessId();

  const purchasePayload = {
    ...purchase,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("purchases")
    .insert([purchasePayload])
    .select()
    .single();

  if (error) {
    console.error(
      "Save Purchase Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ============================
   Save Purchase Items
============================ */

export async function savePurchaseItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "Purchase items are required."
    );
  }

  const businessId = await getCurrentBusinessId();

  const purchaseIds = [
    ...new Set(
      items
        .map((item) => Number(item.purchase_id))
        .filter(Boolean)
    ),
  ];

  if (purchaseIds.length !== 1) {
    throw new Error(
      "All purchase items must belong to one purchase."
    );
  }

  const purchaseId = purchaseIds[0];

  const { data: purchase, error: purchaseError } =
    await supabase
      .from("purchases")
      .select("id, business_id")
      .eq("id", purchaseId)
      .eq("business_id", businessId)
      .maybeSingle();

  if (purchaseError) {
    console.error(
      "Purchase Ownership Check Error:",
      purchaseError
    );

    throw purchaseError;
  }

  if (!purchase) {
    throw new Error(
      "Purchase does not belong to the current business."
    );
  }

  const purchaseItems = items.map((item) => ({
    purchase_id: purchaseId,
    product_id: Number(item.product_id),
    quantity: Number(item.quantity),
    price: Number(item.price),
    total: Number(item.total),
  }));

  const { data, error } = await supabase
    .from("purchase_items")
    .insert(purchaseItems)
    .select();

  if (error) {
    console.error(
      "Save Purchase Items Error:",
      error
    );

    throw error;
  }

  return data || [];
}


/* ============================
   Increase Stock
============================ */

export async function increaseStock(
  productId,
  quantity,
  purchaseId
) {
  const businessId = await getCurrentBusinessId();

  const productIdNumber = Number(productId);
  const quantityNumber = Number(quantity);
  const purchaseIdNumber = Number(purchaseId);

  if (!productIdNumber) {
    throw new Error(
      "Product ID is required."
    );
  }

  if (
    !Number.isFinite(quantityNumber) ||
    quantityNumber <= 0
  ) {
    throw new Error(
      "Stock quantity must be greater than zero."
    );
  }

  if (!purchaseIdNumber) {
    throw new Error(
      "Purchase ID is required."
    );
  }

  const { data: product, error: productError } =
    await supabase
      .from("products")
      .select("id, business_id")
      .eq("id", productIdNumber)
      .eq("business_id", businessId)
      .maybeSingle();

  if (productError) {
    console.error(
      "Product Ownership Check Error:",
      productError
    );

    throw productError;
  }

  if (!product) {
    throw new Error(
      "Product does not belong to the current business."
    );
  }

  const { data: purchase, error: purchaseError } =
    await supabase
      .from("purchases")
      .select("id, business_id")
      .eq("id", purchaseIdNumber)
      .eq("business_id", businessId)
      .maybeSingle();

  if (purchaseError) {
    console.error(
      "Purchase Ownership Check Error:",
      purchaseError
    );

    throw purchaseError;
  }

  if (!purchase) {
    throw new Error(
      "Purchase does not belong to the current business."
    );
  }

  const { data, error } = await supabase.rpc(
    "increase_stock_with_movement",
    {
      p_product_id: productIdNumber,
      p_quantity: quantityNumber,
      p_purchase_id: purchaseIdNumber,
    }
  );

  if (error) {
    console.error(
      "Increase Stock Error:",
      error
    );

    throw error;
  }

  return data;
}


/* ============================
   Get Purchases
   Note: purchases/suppliers tables have RLS with no SELECT policy.
   Direct queries return 0 rows. This throws a descriptive error.
========================== */

export async function getPurchases() {
  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("purchases")
    .select(`
      *,
      suppliers!purchases_business_supplier_tenant_fkey (
        supplier_name
      )
    `)
    .eq("business_id", businessId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Purchases Error:",
      error
    );

    throw error;
  }

  // RLS with no SELECT policy returns 0 rows instead of error
  if (!data || data.length === 0) {
    const err = new Error(
      "Unable to load purchases: missing SELECT policy on purchases table (RLS blocks direct queries). Contact admin to add SELECT policies."
    );
    console.error("Get Purchases: RLS policy issue - no SELECT policy on purchases/suppliers tables");
    throw err;
  }

return data;
}


/* ============================
   Delete Purchase
============================ */

export async function deletePurchase(
  purchaseId
) {
  const businessId = await getCurrentBusinessId();

  const purchaseIdNumber = Number(purchaseId);

  if (!purchaseIdNumber) {
    throw new Error(
      "Purchase ID is required."
    );
  }

  const { data: purchase, error: purchaseError } =
    await supabase
      .from("purchases")
      .select("id, business_id")
      .eq("id", purchaseIdNumber)
      .eq("business_id", businessId)
      .maybeSingle();

  if (purchaseError) {
    console.error(
      "Purchase Ownership Check Error:",
      purchaseError
    );

    throw purchaseError;
  }

  if (!purchase) {
    throw new Error(
      "Purchase does not belong to the current business."
    );
  }

  const { data, error } = await supabase.rpc(
    "delete_purchase_safe",
    {
      p_purchase_id: purchaseIdNumber,
    }
  );

  if (error) {
    console.error(
      "Delete Purchase Error:",
      error
    );

    throw error;
  }

  return data;
}