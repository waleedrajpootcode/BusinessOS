import { supabase } from "../lib/supabase";

export async function getNotifications() {

  const notifications = [];

  // Low Stock
  const { data: products } = await supabase
    .from("products")
    .select("product_name, stock");

  products
    ?.filter((p) => Number(p.stock) <= 5)
    .forEach((p) => {
      notifications.push({
        type: "warning",
        message: `${p.product_name} is running low (${p.stock} left)`,
      });
    });

  // Latest Sale
  const { data: sales } = await supabase
    .from("sales")
    .select("invoice_no,total")
    .order("created_at", { ascending: false })
    .limit(3);

  sales?.forEach((sale) => {
    notifications.push({
      type: "success",
      message: `New Sale: ${sale.invoice_no} (PKR ${sale.total})`,
    });
  });

  return notifications;

}