import { supabase } from "../lib/supabase";

/* ===========================
   Total Revenue
=========================== */

export async function getTotalRevenue() {

  const { data, error } = await supabase
    .from("sales")
    .select("total");

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce(
    (sum, sale) => sum + Number(sale.total),
    0
  );

}

/* ===========================
   Total Sales Profit
=========================== */

export async function getTotalSalesProfit() {

  const { data, error } = await supabase
    .from("sales")
    .select("profit");

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce(
    (sum, sale) => sum + Number(sale.profit),
    0
  );

}

/* ===========================
   Total Purchases
=========================== */

export async function getTotalPurchases() {

  const { data, error } = await supabase
    .from("purchases")
    .select("total");

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce(
    (sum, purchase) => sum + Number(purchase.total),
    0
  );

}

/* ===========================
   Total Expenses
=========================== */

export async function getTotalExpenses() {

  const { data, error } = await supabase
    .from("expenses")
    .select("amount");

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

}

/* ===========================
   Net Profit
=========================== */

export async function getNetProfit() {

  const salesProfit =
    await getTotalSalesProfit();

  const expenses =
    await getTotalExpenses();

  return salesProfit - expenses;

}
export async function getMonthlyRevenue() {

  const { data, error } = await supabase
    .from("sales")
    .select("created_at,total");

  if (error) {
    console.error(error);
    return [];
  }

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const revenueMap = {};

  months.forEach((month) => {
    revenueMap[month] = 0;
  });

  data.forEach((sale) => {

    const date = new Date(sale.created_at);

    const month = months[date.getMonth()];

    revenueMap[month] += Number(sale.total);

  });

  return months.map((month) => ({
    month,
    revenue: revenueMap[month],
  }));

}
export async function getTopSellingProducts() {

  const { data, error } = await supabase
    .from("sale_items")
    .select(`
      quantity,
      products (
        product_name
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  const map = {};

  data.forEach((item) => {

    const name =
      item.products?.product_name || "Unknown";

    if (!map[name]) {

      map[name] = 0;

    }

    map[name] += Number(item.quantity);

  });

  return Object.entries(map)
    .map(([name, qty]) => ({
      name,
      qty,
    }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

} 
export async function getLowStockProducts() {

  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, stock");

  if (error) {
    console.error(error);
    return [];
  }

  return data
    .filter(product => Number(product.stock) <= 5)
    .sort((a, b) => a.stock - b.stock);

}
export async function getTopCustomers() {

  const { data, error } = await supabase
    .from("sales")
    .select(`
      total,
      customers (
        full_name
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  const map = {};

  data.forEach((sale) => {

    const name =
      sale.customers?.full_name || "Unknown";

    if (!map[name]) {
      map[name] = 0;
    }

    map[name] += Number(sale.total);

  });

  return Object.entries(map)
    .map(([name, total]) => ({
      name,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

}
export async function getMonthlySalesCount() {

  const { data, error } = await supabase
    .from("sales")
    .select("created_at");

  if (error) {
    console.error(error);
    return [];
  }

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const map = {};

  months.forEach((month) => {
    map[month] = 0;
  });

  data.forEach((sale) => {

    const month =
      months[
        new Date(sale.created_at).getMonth()
      ];

    map[month]++;

  });

  return months.map((month) => ({
    month,
    sales: map[month],
  }));

}
