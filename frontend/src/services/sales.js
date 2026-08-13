import { supabase } from "../lib/supabase";

export async function getProductsForSale() {
  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, cost_price, price, stock")
    .order("product_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getCustomersForSale() {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name")
    .order("full_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
export async function generateInvoiceNumber() {
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

  return `INV-${year}${month}${day}-${random}`;
}
export async function saveSale(sale, items) {
  const { data, error } = await supabase.rpc(
    "create_sale_safe",
    {
      p_invoice_no: sale.invoice_no,
      p_customer_id: Number(sale.customer_id),
      p_subtotal: Number(sale.subtotal),
      p_discount: Number(sale.discount || 0),
      p_tax: Number(sale.tax || 0),
      p_total: Number(sale.total),
      p_profit: Number(sale.profit || 0),
      p_payment_method: sale.payment_method || "Cash",
      p_status: sale.status || "Pending",
      p_items: items,
    }
  );

  if (error) {
    console.error("Create sale RPC error:", error);
    throw error;
  }

  return data;
}
export async function saveSaleItems(items) {

  const { data, error } = await supabase

    .from("sale_items")

    .insert(items)

    .select();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}
export async function updateProductStock(
  productId,
  quantity,
  saleId
) {
  const { data, error } = await supabase.rpc(
    "decrease_stock_with_movement",
    {
      p_product_id: Number(productId),
      p_quantity: Number(quantity),
      p_sale_id: Number(saleId),
    }
  );

  if (error) {
    console.error(
      "Decrease Stock Error:",
      error
    );

    throw error;
  }

  return data;
}
export async function getSales() {
  const { data, error } = await supabase.rpc(
    "get_sales_with_payment_summary"
  );

  if (error) {
    console.error("Get sales RPC error:", error);
    return [];
  }

  return (data || []).map((sale) => ({
    ...sale,

    id: sale.sale_id,

    total: Number(sale.invoice_total || 0),

    total_paid: Number(sale.total_paid || 0),

    outstanding: Number(sale.outstanding || 0),

    status: sale.payment_status,

    customers: {
      full_name: sale.customer_name || "Unknown Customer",
    },
  }));
}
export async function getSalesCount() {

  const { count, error } = await supabase
    .from("sales")
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
export async function getRevenue() {

  const { data, error } = await supabase

    .from("sales")

    .select("total");

  if (error) {

    console.error(error);

    return 0;

  }

  const revenue = data.reduce(
    (sum, sale) => sum + Number(sale.total),
    0
  );

  return revenue;

}
export async function getRecentSales() {

  const { data, error } = await supabase

    .from("sales")

    .select(`
      id,
      invoice_no,
      total,
      created_at,
      customers(full_name)
    `)

    .order("created_at", {
      ascending: false,
    })

    .limit(5);

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}
/* ===========================
   Top Selling Products
=========================== */

export async function getTopSellingProducts(limit = 5) {

  const { data, error } = await supabase

    .from("sale_items")

    .select(`
      quantity,
      total,
      products (
        product_name
      )
    `);

  if (error) {

    console.error(error);

    return [];

  }

  const grouped = {};

  data.forEach((item) => {

    const name =
      item.products?.product_name;

    if (!name) return;

    if (!grouped[name]) {

      grouped[name] = {
        product_name: name,
        quantity: 0,
        revenue: 0,
      };

    }

    grouped[name].quantity +=
      Number(item.quantity);

    grouped[name].revenue +=
      Number(item.total);

  });

  return Object.values(grouped)

    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )

    .slice(0, limit);

}
