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

  const revenue =
    await getTotalRevenue();

  const purchases =
    await getTotalPurchases();

  const expenses =
    await getTotalExpenses();

  return revenue - purchases - expenses;

}