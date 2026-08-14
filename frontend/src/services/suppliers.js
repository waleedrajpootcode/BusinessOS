import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

// Get All Suppliers
export async function getSuppliers() {

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("supplier_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// Add Supplier
export async function addSupplier(supplier) {
  const businessId = await getCurrentBusinessId();

  const supplierPayload = {
    ...supplier,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("suppliers")
    .insert([supplierPayload])
    .select()
    .single();

  if (error) {
    console.error("Add Supplier Error:", error);
    throw error;
  }

  return data;
}

// Update Supplier
export async function updateSupplier(id, supplier) {

  const { data, error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Delete Supplier
export async function deleteSupplier(id) {

  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

// Suppliers Count
export async function getSuppliersCount() {

  const { count, error } = await supabase
    .from("suppliers")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    return 0;
  }

  return count;
}