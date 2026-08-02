import { supabase } from "../lib/supabase";

/* ===========================
   Low Stock Products
=========================== */

export async function getLowStockProducts(limit = 5) {

  const { data, error } = await supabase
  .from("products")
  .select(`
    id,
    product_name,
    stock
  `)
  .lt("stock", 10)
  .order("stock", {
    ascending: true,
  })
  .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

