const MAX_LOW_STOCK_ITEMS = 50;
const MAX_RECENT_PAYMENTS = 10;
const ALLOWED_AVAILABILITY = new Set([
  "available",
  "empty",
  "unavailable",
  "partial",
]);

const GUIDED_HANDLER_BY_QUESTION = Object.freeze({
  sales_002: {
    handlerId: "sales.overview",
    resultType: "sales_overview",
    execute: getSalesOverview,
  },
  sales_004: {
    handlerId: "sales.topSellingProducts",
    resultType: "top_products",
    execute: getTopSellingProducts,
  },
  profit_001: {
    handlerId: "profit.overview",
    resultType: "profit_overview",
    execute: getProfitOverview,
  },
  profit_002: {
    handlerId: "profit.overview",
    resultType: "profit_overview",
    execute: getProfitOverview,
  },
  profit_003: {
    handlerId: "profit.overview",
    resultType: "profit_overview",
    execute: getProfitOverview,
  },
  expenses_001: {
    handlerId: "expenses.overview",
    resultType: "expenses_overview",
    execute: getExpensesOverview,
  },
  inventory_002: {
    handlerId: "inventory.lowStock",
    resultType: "low_stock",
    execute: getLowStockProducts,
  },
  customers_002: {
    handlerId: "customers.topCustomers",
    resultType: "top_customers",
    execute: getTopCustomers,
  },
  customers_003: {
    handlerId: "customers.topCustomers",
    resultType: "top_customers",
    execute: getTopCustomers,
  },
  payments_001: {
    handlerId: "payments.receivables",
    resultType: "receivables",
    execute: getReceivables,
  },
  payments_002: {
    handlerId: "payments.receivables",
    resultType: "receivables",
    execute: getReceivables,
  },
  suppliers_001: {
    handlerId: "suppliers.overview",
    resultType: "suppliers_overview",
    execute: getSuppliersOverview,
  },
});

function createResult({
  questionId,
  handlerId,
  resultType,
  facts = {},
  availability = "unavailable",
  asOf = new Date().toISOString(),
}) {
  return {
    questionId,
    handlerId,
    resultType,
    facts,
    calculations: [],
    recommendations: [],
    availability,
    asOf,
    provenance: ["business_intelligence"],
  };
}

function unavailableResult(questionId, handlerId, resultType, reason) {
  return createResult({
    questionId,
    handlerId,
    resultType,
    facts: {
      unavailableReason: reason,
    },
    availability: "unavailable",
  });
}

function getHandler(questionId) {
  if (typeof questionId !== "string") {
    return null;
  }

  return GUIDED_HANDLER_BY_QUESTION[questionId] || null;
}

function validateBusinessContext(businessId) {
  return typeof businessId === "string" && businessId.trim().length > 0;
}

function validateResult(result) {
  if (
    !result ||
    typeof result !== "object" ||
    typeof result.questionId !== "string" ||
    typeof result.handlerId !== "string" ||
    typeof result.resultType !== "string" ||
    !result.facts ||
    typeof result.facts !== "object" ||
    Array.isArray(result.facts) ||
    !ALLOWED_AVAILABILITY.has(result.availability) ||
    !Array.isArray(result.calculations) ||
    !Array.isArray(result.recommendations) ||
    !Array.isArray(result.provenance)
  ) {
    return false;
  }

  const serialized = JSON.stringify(result);
  return !/(accessToken|authorization|businessId|business_id|userId|token|jwt|provider|model|secret|credential|supabase)/i.test(serialized);
}

async function getSalesOverview({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified database aggregate for sales totals is not available in the current repository contract."
  );
}

async function getProfitOverview({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified database aggregate for profit totals is not available in the current repository contract."
  );
}

async function getExpensesOverview({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified database aggregate for expense totals is not available in the current repository contract."
  );
}

async function getTopSellingProducts({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified bounded top-products aggregate is not available in the current repository contract."
  );
}

async function getTopCustomers({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified bounded top-customers aggregate is not available in the current repository contract."
  );
}

async function getReceivables({ questionId, handlerId, resultType }) {
  return unavailableResult(
    questionId,
    handlerId,
    resultType,
    "A verified bounded receivables aggregate is not available in the current repository contract."
  );
}

async function getLowStockProducts({
  questionId,
  handlerId,
  resultType,
  supabase,
  businessId,
}) {
  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, stock")
    .eq("business_id", businessId)
    .lte("stock", 5)
    .order("stock", { ascending: true })
    .limit(MAX_LOW_STOCK_ITEMS);

  if (error) {
    throw new Error("Low-stock information could not be retrieved.");
  }

  const items = Array.isArray(data) ? data : [];

  return createResult({
    questionId,
    handlerId,
    resultType,
    facts: { items },
    availability: items.length > 0 ? "available" : "empty",
  });
}

async function getSuppliersOverview({
  questionId,
  handlerId,
  resultType,
  supabase,
  businessId,
}) {
  const { count, error: countError } = await supabase
    .from("suppliers")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  if (countError) {
    throw new Error("Supplier information could not be retrieved.");
  }

  const { data: recentPayments, error: paymentError } = await supabase
    .from("supplier_payments")
    .select("id, purchase_id, amount, payment_method, payment_date, notes")
    .eq("business_id", businessId)
    .order("payment_date", { ascending: false })
    .limit(MAX_RECENT_PAYMENTS);

  if (paymentError) {
    throw new Error("Supplier payment information could not be retrieved.");
  }

  const payments = Array.isArray(recentPayments)
    ? recentPayments
    : [];

  return createResult({
    questionId,
    handlerId,
    resultType,
    facts: {
      totalSuppliers: count || 0,
      recentPayments: payments,
      totalPaid: null,
    },
    availability: "partial",
  });
}

async function executeGuidedQuestion({
  questionId,
  accessToken,
  businessId,
  client,
} = {}) {
  const handler = getHandler(questionId);

  if (!handler) {
    return {
      success: false,
      status: 404,
      code: "GUIDED_HANDLER_NOT_FOUND",
      message: "The requested Guided Intelligence question is not available.",
    };
  }

  if (!validateBusinessContext(businessId)) {
    return {
      success: false,
      status: 500,
      code: "BUSINESS_CONTEXT_REQUIRED",
      message: "Authenticated business context is required.",
    };
  }

  try {
    const supabase =
      client ||
      require("./supabaseClient").createAuthenticatedSupabaseClient(
        accessToken
      );
    const result = await handler.execute({
      questionId,
      handlerId: handler.handlerId,
      resultType: handler.resultType,
      supabase,
      businessId,
    });

    if (!validateResult(result)) {
      return {
        success: false,
        status: 502,
        code: "INVALID_BI_RESULT",
        message: "Business Intelligence returned an invalid result.",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("BusinessOS Guided Intelligence Error:", error);

    return {
      success: false,
      status: 503,
      code: "BI_DATA_UNAVAILABLE",
      message: "Business Intelligence data is currently unavailable.",
    };
  }
}

module.exports = {
  ALLOWED_AVAILABILITY,
  GUIDED_HANDLER_BY_QUESTION,
  MAX_LOW_STOCK_ITEMS,
  MAX_RECENT_PAYMENTS,
  createResult,
  getHandler,
  validateResult,
  executeGuidedQuestion,
};
