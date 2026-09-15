/**
 * BusinessOS AI Query Response
 *
 * Day 5 — Human-friendly natural-language query responses.
 *
 * IMPORTANT:
 * - Uses only data returned by the safe Query Router.
 * - No database access.
 * - No database writes.
 * - No arbitrary SQL.
 * - No fabricated financial numbers.
 */

function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "unavailable";

  return amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}


function formatCount(value) {
  const count = Number(value);
  return Number.isFinite(count) ? count.toLocaleString("en-US") : "unavailable";
}


/* ===========================
   Sales
=========================== */

function buildSalesResponse(data) {
  const revenue = data?.revenue;
  const profit = data?.profit;

  return (
    `Your recorded sales revenue is PKR ${formatAmount(revenue)}, ` +
    `with sales profit of PKR ${formatAmount(profit)}.`
  );
}


/* ===========================
   Expenses
=========================== */

function buildExpenseResponse(data) {
  const expenses = data?.totalExpenses;

  return (
    `Your recorded business expenses are ` +
    `PKR ${formatAmount(expenses)}.`
  );
}


/* ===========================
   Profit
=========================== */

function buildProfitResponse(data) {
  const salesProfit = data?.salesProfit;
  const expenses = data?.expenses;
  const netProfit = data?.netProfit;

  return (
    `Your sales profit is PKR ${formatAmount(salesProfit)}, ` +
    `expenses are PKR ${formatAmount(expenses)}, ` +
    `and current net profit is PKR ${formatAmount(netProfit)}.`
  );
}


/* ===========================
   Inventory
=========================== */

function buildInventoryResponse(data) {
  const lowStockProducts = Array.isArray(
    data?.lowStockProducts
  )
    ? data.lowStockProducts
    : [];

  const topSellingProducts = Array.isArray(
    data?.topSellingProducts
  )
    ? data.topSellingProducts
    : [];

  if (lowStockProducts.length === 0) {
    return (
      `I found no products currently marked as low stock. ` +
      `${formatCount(topSellingProducts.length)} top-selling product record(s) ` +
      `are available.`
    );
  }

  const names = lowStockProducts
    .slice(0, 5)
    .map((product) => product?.product_name)
    .filter(Boolean);

  const productList =
    names.length > 0
      ? ` Products to review: ${names.join(", ")}.`
      : "";

  return (
    `${formatCount(lowStockProducts.length)} product(s) ` +
    `are currently marked as low stock.` +
    productList
  );
}


/* ===========================
   Customers
=========================== */

function buildCustomerResponse(data) {
  const customerReceivables = Array.isArray(
    data?.customerReceivables
  )
    ? data.customerReceivables
    : [];

  const topCustomers = Array.isArray(
    data?.topCustomers
  )
    ? data.topCustomers
    : [];

  if (customerReceivables.length === 0) {
    return (
      "There are currently no customer receivable records " +
      "available for analysis."
    );
  }

  const outstandingCustomers =
    customerReceivables.filter(
      (customer) =>
        Number.isFinite(Number(customer?.outstanding)) &&
        Number(customer.outstanding) > 0
    );

  return (
    `${formatCount(outstandingCustomers.length)} customer account(s) ` +
    `currently have outstanding balances. ` +
    `${formatCount(topCustomers.length)} top customer record(s) ` +
    `are also available.`
  );
}


/* ===========================
   Suppliers
=========================== */

function buildSupplierResponse(data) {
  const totalSuppliers = data?.totalSuppliers;
  const totalPaid = data?.totalPaid;

  return (
    `There are ${formatCount(totalSuppliers)} supplier(s) ` +
    `in the available business data, with recorded supplier payments ` +
    `of PKR ${formatAmount(totalPaid)}.`
  );
}


/* ===========================
   Payments
=========================== */

function buildPaymentResponse(data) {
  const customer = data?.customer;

  if (!customer) {
    return (
      "Customer payment information is currently unavailable."
    );
  }

  const totalReceivable = customer?.totalReceivable;
  const totalCollected = customer?.totalCollected;
  const customersWithDue = customer?.customersWithDue;

  if (
    Number.isFinite(Number(totalReceivable)) &&
    Number.isFinite(Number(customersWithDue)) &&
    Number(totalReceivable) <= 0 &&
    Number(customersWithDue) <= 0
  ) {
    return (
      "There are currently no customer outstanding payments " +
      "in the available business data."
    );
  }

  return (
    `Customers currently owe PKR ${formatAmount(totalReceivable)}. ` +
    `PKR ${formatAmount(totalCollected)} has been collected, ` +
    `and ${formatCount(customersWithDue)} customer account(s) ` +
    `have outstanding dues.`
  );
}


/* ===========================
   Business Summary
=========================== */

function buildSummaryResponse(data) {
  const revenue = data?.revenue;
  const salesProfit = data?.salesProfit;
  const purchases = data?.purchases;
  const expenses = data?.expenses;
  const netProfit = data?.netProfit;
  const receivable = data?.receivables?.totalReceivable;

  return (
    `Your business currently has revenue of ` +
    `PKR ${formatAmount(revenue)}, sales profit of ` +
    `PKR ${formatAmount(salesProfit)}, purchases of ` +
    `PKR ${formatAmount(purchases)}, expenses of ` +
    `PKR ${formatAmount(expenses)}, and net profit of ` +
    `PKR ${formatAmount(netProfit)}. ` +
    `Customer outstanding is PKR ${formatAmount(receivable)}.`
  );
}

function buildMarketResponse(data) {
  if (!data?.success) {
    return (
      data?.message ||
      "Fresh market information is currently unavailable."
    );
  }

  const articles = Array.isArray(data?.articles)
    ? data.articles
    : [];

  if (articles.length === 0) {
    return (
      `I could not find fresh market information for "${data?.topic || "this topic"}" right now.`
    );
  }

  const articleLines = articles
    .slice(0, 5)
    .map((article, index) => {
      const title = String(
        article?.title || "Untitled article"
      ).trim();

      const source = String(
        article?.source || "Unknown source"
      ).trim();

      return `${index + 1}. ${title} — ${source}`;
    });

  return (
    `Here are some recent market signals related to "${data?.topic || "your topic"}":\n\n` +
    articleLines.join("\n") +
    `\n\nThese are external market-news signals. Use them as market context rather than as guaranteed business recommendations.`
  );
}


/* ===========================
   Public API
=========================== */

export function buildQueryResponse(result) {
  if (!result?.success) {
    return {
      success: false,
      message:
        result?.message ||
        "I could not understand or retrieve that business information.",
    };
  }


  let message;


  switch (result.intent) {
    case "sales":
      message = buildSalesResponse(result.data);
      break;

    case "expenses":
      message = buildExpenseResponse(result.data);
      break;

    case "profit":
      message = buildProfitResponse(result.data);
      break;

    case "inventory":
      message = buildInventoryResponse(result.data);
      break;

    case "customers":
      message = buildCustomerResponse(result.data);
      break;

    case "suppliers":
      message = buildSupplierResponse(result.data);
      break;

    case "payments":
      message = buildPaymentResponse(result.data);
      break;

    case "market":
      message = buildMarketResponse(result.data);
      break;

    case "summary":
      message = buildSummaryResponse(result.data);
      break;

    default:
      return {
        success: false,
        message:
          "I do not have a response format for that business question yet.",
      };
  }


  return {
    success: true,
    intent: result.intent,
    message,
  };
}