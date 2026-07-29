import { supabase } from "../lib/supabase";

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addCustomer(customer) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function updateCustomer(id, customer) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getCustomersCount() {
  const { count, error } = await supabase
    .from("customers")
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