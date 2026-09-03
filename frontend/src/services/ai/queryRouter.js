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

import {
  searchMarketIntelligence,
} from "./marketIntelligence";


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
     Market Intelligence
  =========================== */

 if (
  matchesAny(query, [
    "market trend",
    "market trends",
    "business trend",
    "business trends",
    "retail trend",
    "retail trends",

    "market mein kya",
    "market me kya",
    "market main kya",

    "market mein kya chal",
    "market me kya chal",
    "market main kya chal",

    "aaj kal market",
    "aajkal market",
    "aaj kal business",
    "aajkal business",

    "aaj kal retail",
    "aajkal retail",
    "aaj kal pakistan retail",
    "aajkal pakistan retail",

    "pakistan retail market",
    "pakistan market trend",
    "pakistan business trend",

    "world mein kya trend",
    "world me kya trend",
    "world main kya trend",

    "duniya mein kya trend",
    "duniya me kya trend",
    "duniya main kya trend",

    "abhi market mein",
    "abhi market me",
    "abhi market main",
    "abhi business mein",
    "abhi business me",
    "abhi business main",
  ])
) {
  return "market";
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

              case "market": {
  let marketTopic = normalizedQuery;

  marketTopic = marketTopic
    .replace(
      /^(aaj kal|aajkal|abhi|currently)\s+/,
      ""
    )
    .replace(
      /\b(kya trend chal raha hai|kya trend chal raha|kya trends chal rahe hain|kya trends chal rahe|kya trend hai|kya trends hain|kya chal raha hai|kya chal rahi hai|kya chal rahe hain)\b/g,
      ""
    )
    .replace(
      /\b(mujhe batao|batao|batayein|bata dein|please|right now|currently)\b/g,
      ""
    )
    .replace(/\?+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!marketTopic) {
    marketTopic = "business market trends";
  }

  return {
    success: true,
    intent,
    data: await searchMarketIntelligence(
      marketTopic
    ),
  };
}

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