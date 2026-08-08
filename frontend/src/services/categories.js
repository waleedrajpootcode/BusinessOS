import { supabase } from "../lib/supabase";

/* ===========================
   Get Categories
=========================== */

export async function getCategories() {

  const { data, error } = await supabase

    .from("categories")

    .select("*")

    .eq("status", "active")

    .order("category_name", { ascending: true });

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}