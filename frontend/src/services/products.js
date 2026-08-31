import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

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
  const businessId = await getCurrentBusinessId();

  const productPayload = {
    ...product,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([productPayload])
    .select();

  if (error) {
    console.error("Add Product Error:", error);
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
  const { data, error } = await supabase.rpc(
    "delete_product_safe",
    {
      p_product_id: Number(id),
    }
  );

  if (error) {
    console.error(
      "Safe Product Delete Error:",
      error
    );

    throw error;
  }

  return data;
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
export async function getProductUnit(productId) {
  const { data, error } = await supabase
    .from("product_units")
    .select(`
      id,
      business_id,
      product_id,
      unit_type,
      base_unit,
      conversion_factor,
      is_default
    `)
    .eq("product_id", Number(productId))
    .maybeSingle();

  if (error) {
    console.error("Get Product Unit Error:", error);
    throw error;
  }

  return data;
}

export async function saveProductUnit(productId, unitSettings) {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    throw new Error(
      "Business information is not available."
    );
  }

  const { data, error } = await supabase
    .from("product_units")
    .upsert(
      {
        business_id: businessId,
        product_id: Number(productId),

        unit_type: unitSettings.unit_type,

        base_unit: unitSettings.base_unit,

        selling_unit: unitSettings.selling_unit,

        conversion_factor: Number(
          unitSettings.conversion_factor
        ),

        is_default: true,
      },
      {
        onConflict: "product_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error(
      "Save Product Unit Error:",
      error
    );

    throw error;
  }

  return data;
}
export async function deleteProductUnit(productId) {
  const { error } = await supabase
    .from("product_units")
    .delete()
    .eq("product_id", Number(productId));

  if (error) {
    console.error("Delete Product Unit Error:", error);
    throw error;
  }

  return true;
}