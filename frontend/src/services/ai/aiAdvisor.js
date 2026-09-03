/**
 * BusinessOS AI Advisor
 *
 * Day 5 — AI Business Advisor foundation.
 *
 * IMPORTANT:
 * - Read-only analysis only.
 * - Uses approved BusinessOS insight functions.
 * - No database writes.
 * - No arbitrary SQL.
 * - No AI provider/API key.
 * - No financial action execution.
 */

import {
  getBusinessSummary,
  getSalesInsights,
  getExpenseInsights,
  getProfitInsights,
  getInventoryInsights,
  getCustomerInsights,
  getSupplierInsights,
  getPaymentInsights,
} from "./businessInsights";


function calculateBusinessHealth({
  revenue,
  netProfit,
  expenses,
  totalReceivable,
  lowStockCount,
}) {
  const safeRevenue = Number(revenue || 0);
  const safeProfit = Number(netProfit || 0);
  const safeExpenses = Number(expenses || 0);
  const safeReceivable = Number(totalReceivable || 0);
  const safeLowStock = Number(lowStockCount || 0);


  if (safeRevenue <= 0) {
    return {
      status: "attention",
      label: "Needs Attention",
      reason:
        "There is not enough sales data yet to determine a healthy business trend.",
    };
  }


  if (safeProfit <= 0) {
    return {
      status: "critical",
      label: "Needs Attention",
      reason:
        "The current business data shows no positive net profit.",
    };
  }


  if (safeReceivable > safeRevenue * 0.5) {
    return {
      status: "attention",
      label: "Watch Cash Collection",
      reason:
        "Customer receivables are high compared with total revenue.",
    };
  }


  if (
    safeLowStock > 0 &&
    safeExpenses > safeRevenue * 0.2
  ) {
    return {
      status: "attention",
      label: "Monitor Closely",
      reason:
        "There are low-stock products while expenses are also significant.",
    };
  }


  return {
    status: "healthy",
    label: "Stable",
    reason:
      "The available business data shows positive net profit and no immediate critical issue.",
  };
}


function buildRecommendations({
  summary,
  inventory,
  payments,
}) {
  const recommendations = [];


  const revenue = Number(
    summary?.revenue || 0
  );

  const expenses = Number(
    summary?.expenses || 0
  );

  const netProfit = Number(
    summary?.netProfit || 0
  );


  const receivable = Number(
    summary?.receivables?.totalReceivable || 0
  );


  const lowStockProducts = Array.isArray(
    inventory?.lowStockProducts
  )
    ? inventory.lowStockProducts
    : [];


  const customerAccounts = Array.isArray(
    payments?.customerAccounts
  )
    ? payments.customerAccounts
    : [];


  if (customerAccounts.length > 0) {
    recommendations.push({
      type: "payments",
      priority: "high",
      message:
        "Follow up with customers who have outstanding payments.",
    });
  }


  if (lowStockProducts.length > 0) {
    recommendations.push({
      type: "inventory",
      priority: "high",
      message:
        "Review low-stock products and replenish items that are selling consistently.",
    });
  }


  if (
    revenue > 0 &&
    expenses > revenue * 0.2
  ) {
    recommendations.push({
      type: "expenses",
      priority: "medium",
      message:
        "Review operating expenses and identify areas where unnecessary costs can be reduced.",
    });
  }


  if (
    revenue > 0 &&
    receivable > revenue * 0.5
  ) {
    recommendations.push({
      type: "cash_flow",
      priority: "high",
      message:
        "Customer receivables are relatively high, so improving payment collection may help cash flow.",
    });
  }


  if (
    netProfit > 0 &&
    recommendations.length === 0
  ) {
    recommendations.push({
      type: "general",
      priority: "low",
      message:
        "Continue monitoring sales, expenses, inventory and customer payments regularly.",
    });
  }


  return recommendations;
}


export async function analyzeBusiness() {
  const [
    summary,
    sales,
    expenses,
    profit,
    inventory,
    customers,
    suppliers,
    payments,
  ] = await Promise.all([
    getBusinessSummary(),
    getSalesInsights(),
    getExpenseInsights(),
    getProfitInsights(),
    getInventoryInsights(),
    getCustomerInsights(),
    getSupplierInsights(),
    getPaymentInsights(),
  ]);


  const health = calculateBusinessHealth({
    revenue: summary?.revenue,
    netProfit: summary?.netProfit,
    expenses: summary?.expenses,
    totalReceivable:
      summary?.receivables?.totalReceivable,
    lowStockCount:
      inventory?.lowStockProducts?.length || 0,
  });


  const recommendations =
    buildRecommendations({
      summary,
      inventory,
      payments,
    });


  return {
    success: true,
    health,
    summary,
    sales,
    expenses,
    profit,
    inventory,
    customers,
    suppliers,
    payments,
    recommendations,
  };
}