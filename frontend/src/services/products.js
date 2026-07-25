import { supabase } from "../lib/supabase";

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