import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";

/* ===========================
   Get All Suppliers
=========================== */

export async function getSuppliers() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    console.error("Get Suppliers Error: Business ID not found.");
    return [];
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("business_id", businessId)
    .order("supplier_name");

  if (error) {
    console.error("Get Suppliers Error:", error);
    return [];
  }

  return data || [];
}


/* ===========================
   Add Supplier
=========================== */

export async function addSupplier(supplier) {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    throw new Error("Business information not found.");
  }

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


/* ===========================
   Update Supplier
=========================== */

export async function updateSupplier(id, supplier) {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    throw new Error("Business information not found.");
  }

  const supplierId = Number(id);

  if (!supplierId) {
    throw new Error("Supplier ID is required.");
  }

  const supplierPayload = {
    ...supplier,
    business_id: businessId,
  };

  const { data, error } = await supabase
    .from("suppliers")
    .update(supplierPayload)
    .eq("id", supplierId)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) {
    console.error("Update Supplier Error:", error);
    throw error;
  }

  return data;
}


/* ===========================
   Delete Supplier
=========================== */

export async function deleteSupplier(id) {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    throw new Error("Business information not found.");
  }

  const supplierId = Number(id);

  if (!supplierId) {
    throw new Error("Supplier ID is required.");
  }

  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", supplierId)
    .eq("business_id", businessId);

  if (error) {
    console.error("Delete Supplier Error:", error);
    throw error;
  }

  return true;
}


/* ===========================
   Suppliers Count
=========================== */

export async function getSuppliersCount() {
  const businessId = await getCurrentBusinessId();

  if (!businessId) {
    return 0;
  }

  const { count, error } = await supabase
    .from("suppliers")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("business_id", businessId);

  if (error) {
    console.error("Get Suppliers Count Error:", error);
    return 0;
  }

  return count || 0;
}