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
/* ===========================
   Receivables Summary
=========================== */

export async function getReceivablesSummary() {
  const { data, error } = await supabase
    .from("customer_payment_summary")
    .select(`
      customer_id,
      invoice_total,
      total_paid,
      outstanding
    `);

  if (error) {
    console.error("Receivables Summary Error:", error);
    return {
      totalReceivable: 0,
      totalCollected: 0,
      customersWithDue: 0,
    };
  }

  const rows = data || [];

  const totalReceivable = rows.reduce(
    (sum, item) =>
      sum + Number(item.outstanding || 0),
    0
  );

  const totalCollected = rows.reduce(
    (sum, item) =>
      sum + Number(item.total_paid || 0),
    0
  );

  const customerIdsWithDue = new Set(
    rows
      .filter(
        (item) => Number(item.outstanding || 0) > 0
      )
      .map((item) => Number(item.customer_id))
  );

  return {
    totalReceivable,
    totalCollected,
    customersWithDue: customerIdsWithDue.size,
  };
}


/* ===========================
   Customer Receivables
=========================== */

export async function getCustomerReceivables() {
  const { data, error } = await supabase
    .from("customer_payment_summary")
    .select(`
      customer_id,
      invoice_total,
      total_paid,
      outstanding
    `);

  if (error) {
    console.error(
      "Customer Receivables Error:",
      error
    );

    return [];
  }

  const rows = data || [];

  if (rows.length === 0) {
    return [];
  }

  const customerIds = [
    ...new Set(
      rows.map(
        (item) => Number(item.customer_id)
      )
    ),
  ];

  const { data: customers, error: customerError } =
    await supabase
      .from("customers")
      .select("id, full_name")
      .in("id", customerIds);

  if (customerError) {
    console.error(
      "Customer Receivables Customer Error:",
      customerError
    );

    return [];
  }

  const customerMap = {};

  (customers || []).forEach((customer) => {
    customerMap[Number(customer.id)] =
      customer.full_name;
  });

  const grouped = {};

  rows.forEach((item) => {
    const customerId = Number(
      item.customer_id
    );

    if (!grouped[customerId]) {
      grouped[customerId] = {
        customer_id: customerId,
        customer_name:
          customerMap[customerId] ||
          "Unknown Customer",
        total_sales: 0,
        total_paid: 0,
        outstanding: 0,
      };
    }

    grouped[customerId].total_sales +=
      Number(item.invoice_total || 0);

    grouped[customerId].total_paid +=
      Number(item.total_paid || 0);

    grouped[customerId].outstanding +=
      Number(item.outstanding || 0);
  });

  return Object.values(grouped)
    .map((customer) => {
      let status = "Paid";

      if (customer.outstanding > 0) {
        if (customer.total_paid > 0) {
          status = "Partial";
        } else {
          status = "Unpaid";
        }
      }

      return {
        ...customer,
        status,
      };
    })
    .sort(
      (a, b) =>
        b.outstanding - a.outstanding
    );
}
