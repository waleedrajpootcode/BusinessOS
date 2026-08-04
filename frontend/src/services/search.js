import { supabase } from "../lib/supabase";

export async function globalSearch(query) {

  if (!query || query.trim() === "") {
    return {
      products: [],
      customers: [],
      sales: [],
    };
  }

  const search = query.trim();

  const [products, customers, sales] = await Promise.all([

    supabase
      .from("products")
      .select("id, product_name, stock")
      .ilike("product_name", `%${search}%`)
      .limit(5),

    supabase
      .from("customers")
      .select("id, full_name")
      .ilike("full_name", `%${search}%`)
      .limit(5),

    supabase
      .from("sales")
      .select(`
        id,
        invoice_no,
        total,
        customers(full_name)
      `)
      .ilike("invoice_no", `%${search}%`)
      .limit(5),

  ]);

  return {

    products: products.data || [],

    customers: customers.data || [],

    sales: sales.data || [],

  };

}