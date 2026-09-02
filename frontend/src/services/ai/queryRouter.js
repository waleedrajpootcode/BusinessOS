/**
 * BusinessOS AI Query Router
 *
 * Day 5 — Natural-language query foundation.
 *
 * IMPORTANT:
 * - Read-only routing only.
 * - No arbitrary SQL.
 * - No database writes.
 * - No AI provider/API key.
 * - Only approved BusinessOS insight functions.
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


function normalizeQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase();
}


function matchesAny(query, keywords) {
  return keywords.some((keyword) =>
    query.includes(keyword)
  );
}


/* ===========================
   Query Classification
=========================== */

function classifyQuery(query) {
  /* ===========================
     Payment queries first
     because they can also contain
     customer/supplier keywords.
  =========================== */

  if (
    matchesAny(query, [
      "customer payment",
      "customer payments",
      "payment outstanding",
      "payments outstanding",
      "payment due",
      "payments due",
      "total payment",
      "total payments",
      "receivable",
      "receivables",
      "outstanding",
      "udhaar",
      "lena",
      "dena",
    ])
  ) {
    return "payments";
  }


  /* ===========================
     Profit
  =========================== */

  if (
    matchesAny(query, [
      "net profit",
      "profit",
      "munafa",
      "munafa kitna",
      "profit kitna",
    ])
  ) {
    return "profit";
  }


  /* ===========================
     Expenses
  =========================== */

  if (
    matchesAny(query, [
      "expense",
      "expenses",
      "kharcha",
      "kharchay",
      "kharch",
    ])
  ) {
    return "expenses";
  }


  /* ===========================
     Sales
  =========================== */

  if (
    matchesAny(query, [
      "sales",
      "sale",
      "revenue",
      "bikri",
      "sales kitni",
    ])
  ) {
    return "sales";
  }


  /* ===========================
     Inventory
  =========================== */

  if (
    matchesAny(query, [
      "low stock",
      "low-stock",
      "stock low",
      "inventory",
      "stock",
      "maal",
    ])
  ) {
    return "inventory";
  }


  /* ===========================
     Customer
  =========================== */

  if (
    matchesAny(query, [
      "customer",
      "customers",
      "client",
      "clients",
      "customer outstanding",
      "customer due",
      "customers due",
    ])
  ) {
    return "customers";
  }


  /* ===========================
     Supplier
  =========================== */

  if (
    matchesAny(query, [
      "supplier",
      "suppliers",
      "vendor",
      "vendors",
    ])
  ) {
    return "suppliers";
  }


  /* ===========================
     General Payment Queries
  =========================== */

  if (
    matchesAny(query, [
      "payment",
      "payments",
      "due",
    ])
  ) {
    return "payments";
  }


  /* ===========================
     Business Summary
  =========================== */

  if (
    matchesAny(query, [
      "summary",
      "business summary",
      "business overview",
      "overall business",
      "overall",
      "business kaisa",
      "business kaise",
    ])
  ) {
    return "summary";
  }


  return "unknown";
}


/* ===========================
   Safe Query Execution
=========================== */

export async function routeBusinessQuery(query) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return {
      success: false,
      type: "empty_query",
      message: "Please enter a business question.",
    };
  }

  const intent = classifyQuery(normalizedQuery);

  try {
    switch (intent) {
      case "sales":
        return {
          success: true,
          intent,
          data: await getSalesInsights(),
        };

      case "expenses":
        return {
          success: true,
          intent,
          data: await getExpenseInsights(),
        };

      case "profit":
        return {
          success: true,
          intent,
          data: await getProfitInsights(),
        };

      case "inventory":
        return {
          success: true,
          intent,
          data: await getInventoryInsights(),
        };

      case "customers":
        return {
          success: true,
          intent,
          data: await getCustomerInsights(),
        };

      case "suppliers":
        return {
          success: true,
          intent,
          data: await getSupplierInsights(),
        };

      case "payments":
        return {
          success: true,
          intent,
          data: await getPaymentInsights(),
        };

      case "summary":
        return {
          success: true,
          intent,
          data: await getBusinessSummary(),
        };

      default:
        return {
          success: false,
          type: "unknown_query",
          message:
            "I could not understand that business question yet.",
        };
    }
  } catch (error) {
    console.error(
      "BusinessOS AI Query Router Error:",
      error
    );

    return {
      success: false,
      type: "query_error",
      message:
        "I could not retrieve the requested business information.",
    };
  }
}