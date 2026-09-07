/**
 * BusinessOS AI Advisor Response
 *
 * Day 5 — Human-friendly business analysis.
 *
 * IMPORTANT:
 * - Uses only actual Advisor data.
 * - No database access.
 * - No database writes.
 * - No fabricated financial numbers.
 * - No AI provider/API key.
 */


/* ===========================
   Number Formatting
=========================== */

function formatAmount(value) {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}


/* ===========================
   Business Health
=========================== */

function buildHealthMessage(health) {
  if (!health) {
    return "Business health information is currently unavailable.";
  }

  return `${health.label}. ${health.reason}`;
}


/* ===========================
   Financial Summary
=========================== */

function buildFinancialSummary(summary) {
  if (!summary) {
    return "Financial summary is currently unavailable.";
  }

  const revenue = Number(summary.revenue || 0);
  const expenses = Number(summary.expenses || 0);
  const netProfit = Number(summary.netProfit || 0);

  return (
    `Your current revenue is ${formatAmount(revenue)}, ` +
    `expenses are ${formatAmount(expenses)}, ` +
    `and net profit is ${formatAmount(netProfit)}.`
  );
}


/* ===========================
   Customer Payments
=========================== */

function buildCustomerPaymentMessage(payments) {
  const customer = payments?.customer;

  if (!customer) {
    return "Customer payment information is currently unavailable.";
  }

  const receivable = Number(
    customer.totalReceivable || 0
  );

  const collected = Number(
    customer.totalCollected || 0
  );

  const customersWithDue = Number(
    customer.customersWithDue || 0
  );

  if (
    receivable <= 0 &&
    customersWithDue <= 0
  ) {
    return "There are currently no customer outstanding payments in the available data.";
  }

  return (
    `Customers currently owe ${formatAmount(receivable)}. ` +
    `${formatAmount(collected)} has been collected, ` +
    `with ${customersWithDue} customer account(s) having outstanding dues.`
  );
}


/* ===========================
   Inventory
=========================== */

function buildInventoryMessage(inventory) {
  if (!inventory) {
    return "Inventory information is currently unavailable.";
  }

  const lowStockProducts = Array.isArray(
    inventory.lowStockProducts
  )
    ? inventory.lowStockProducts
    : [];

  const topSellingProducts = Array.isArray(
    inventory.topSellingProducts
  )
    ? inventory.topSellingProducts
    : [];

  if (lowStockProducts.length === 0) {
    return (
      `No low-stock products were found in the available data. ` +
      `${topSellingProducts.length} top-selling product record(s) are available for analysis.`
    );
  }

  return (
    `${lowStockProducts.length} product(s) are currently marked as low stock. ` +
    `Review these products and consider replenishing items that are selling consistently.`
  );
}


/* ===========================
   Supplier Information
=========================== */

function buildSupplierMessage(suppliers) {
  if (!suppliers) {
    return "Supplier information is currently unavailable.";
  }

  const totalSuppliers = Number(
    suppliers.totalSuppliers || 0
  );

  const totalPaid = Number(
    suppliers.totalPaid || 0
  );

  return (
    `There are ${totalSuppliers} supplier(s) in the available business data, ` +
    `with recorded supplier payments of ${formatAmount(totalPaid)}.`
  );
}


/* ===========================
   Recommendations
=========================== */

function buildRecommendationMessages(
  recommendations
) {
  if (
    !Array.isArray(recommendations) ||
    recommendations.length === 0
  ) {
    return [
      "No immediate recommendation was generated from the available data.",
    ];
  }

  return recommendations.map(
    (recommendation) =>
      recommendation?.message ||
      "A business recommendation is available."
  );
}


/* ===========================
   Full Advisor Response
=========================== */

export function buildAdvisorResponse(advisor) {
  if (!advisor?.success) {
    return {
      success: false,
      message:
        "I could not prepare the business analysis right now.",
      sections: [],
      recommendations: [],
    };
  }

  const sections = [
    {
      type: "health",
      title: "Business Health",
      message: buildHealthMessage(
        advisor.health
      ),
    },

    {
      type: "financial",
      title: "Financial Overview",
      message: buildFinancialSummary(
        advisor.summary
      ),
    },

    {
      type: "payments",
      title: "Customer Payments",
      message: buildCustomerPaymentMessage(
        advisor.payments
      ),
    },

    {
      type: "inventory",
      title: "Inventory",
      message: buildInventoryMessage(
        advisor.inventory
      ),
    },

    {
      type: "suppliers",
      title: "Suppliers",
      message: buildSupplierMessage(
        advisor.suppliers
      ),
    },
  ];

return {
  success: true,

  headline:
    advisor.health?.label ||
    "Business Analysis",

  summary: advisor.summary,

  sections,

  recommendations:
    buildRecommendationMessages(
      advisor.recommendations
    ),
};
}