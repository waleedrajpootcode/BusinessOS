const AVAILABILITY_STATES = Object.freeze([
  "available",
  "empty",
  "unavailable",
  "partial",
]);

const UNSAFE_FIELDS = new Set([
  "accessToken",
  "authorization",
  "businessId",
  "business_id",
  "credentials",
  "jwt",
  "model",
  "password",
  "provider",
  "secret",
  "supabase",
  "token",
  "userId",
  "user_id",
]);

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function containsUnsafeField(value) {
  if (Array.isArray(value)) {
    return value.some(containsUnsafeField);
  }

  if (!isPlainObject(value)) {
    return false;
  }

  return Object.entries(value).some(([key, item]) =>
    UNSAFE_FIELDS.has(key) || containsUnsafeField(item)
  );
}

function isSafeValue(value) {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return Number.isFinite(value) || typeof value !== "number";
  }

  if (Array.isArray(value)) {
    return value.every(isSafeValue);
  }

  if (isPlainObject(value)) {
    return Object.values(value).every(isSafeValue);
  }

  return false;
}

function normalizeAvailability(data) {
  if (!data || typeof data !== "object") {
    return "unavailable";
  }

  if (data.availability && AVAILABILITY_STATES.includes(data.availability)) {
    return data.availability;
  }

  return Object.keys(data).length === 0 ? "empty" : "available";
}

function compactFacts(facts) {
  return Object.fromEntries(
    Object.entries(facts).filter(([, value]) => value !== undefined)
  );
}

function createResult({
  questionId,
  handlerId,
  resultType,
  facts = {},
  calculations = [],
  recommendations = [],
  availability = "unavailable",
  asOf = null,
}) {
  return {
    questionId,
    handlerId,
    resultType,
    facts,
    calculations,
    recommendations,
    availability,
    asOf,
    provenance: ["business_intelligence"],
  };
}

export const GUIDED_HANDLERS = Object.freeze({
  "sales.overview": Object.freeze({
    handlerId: "sales.overview",
    resultType: "sales_overview",
    requiredData: Object.freeze(["revenue"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "sales.overview",
        resultType: "sales_overview",
        facts: compactFacts({
          revenue: data.revenue,
          profit: data.profit,
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "sales.topSellingProducts": Object.freeze({
    handlerId: "sales.topSellingProducts",
    resultType: "top_products",
    requiredData: Object.freeze(["topProducts"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "sales.topSellingProducts",
        resultType: "top_products",
        facts: compactFacts({
          items: Array.isArray(data.topProducts)
            ? data.topProducts
            : [],
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "profit.overview": Object.freeze({
    handlerId: "profit.overview",
    resultType: "profit_overview",
    requiredData: Object.freeze([
      "salesProfit",
      "expenses",
      "netProfit",
    ]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "profit.overview",
        resultType: "profit_overview",
        facts: compactFacts({
          salesProfit: data.salesProfit,
          expenses: data.expenses,
          netProfit: data.netProfit,
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "expenses.overview": Object.freeze({
    handlerId: "expenses.overview",
    resultType: "expenses_overview",
    requiredData: Object.freeze(["totalExpenses"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "expenses.overview",
        resultType: "expenses_overview",
        facts: compactFacts({
          totalExpenses: data.totalExpenses,
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "inventory.lowStock": Object.freeze({
    handlerId: "inventory.lowStock",
    resultType: "low_stock",
    requiredData: Object.freeze(["lowStockProducts"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "inventory.lowStock",
        resultType: "low_stock",
        facts: compactFacts({
          items: Array.isArray(data.lowStockProducts)
            ? data.lowStockProducts
            : [],
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "customers.topCustomers": Object.freeze({
    handlerId: "customers.topCustomers",
    resultType: "top_customers",
    requiredData: Object.freeze(["topCustomers"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "customers.topCustomers",
        resultType: "top_customers",
        facts: compactFacts({
          items: Array.isArray(data.topCustomers)
            ? data.topCustomers
            : [],
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "payments.receivables": Object.freeze({
    handlerId: "payments.receivables",
    resultType: "receivables",
    requiredData: Object.freeze([
      "customer",
      "customerAccounts",
    ]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "payments.receivables",
        resultType: "receivables",
        facts: compactFacts({
          customer: data.customer,
          accounts: Array.isArray(data.customerAccounts)
            ? data.customerAccounts
            : [],
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),

  "suppliers.overview": Object.freeze({
    handlerId: "suppliers.overview",
    resultType: "suppliers_overview",
    requiredData: Object.freeze(["totalSuppliers", "totalPaid"]),
    execute: (data = {}, context = {}) =>
      createResult({
        questionId: context.questionId,
        handlerId: "suppliers.overview",
        resultType: "suppliers_overview",
        facts: compactFacts({
          totalSuppliers: data.totalSuppliers,
          totalPaid: data.totalPaid,
          recentPayments: Array.isArray(data.recentPayments)
            ? data.recentPayments
            : [],
        }),
        availability: normalizeAvailability(data),
        asOf: context.asOf || null,
      }),
  }),
});

export function getGuidedHandler(handlerId) {
  if (typeof handlerId !== "string") {
    return null;
  }

  return GUIDED_HANDLERS[handlerId] || null;
}

export function createGuidedResult(input = {}) {
  return {
    questionId: input.questionId || null,
    handlerId: input.handlerId || null,
    resultType: input.resultType || null,
    facts: input.facts || {},
    calculations: input.calculations || [],
    recommendations: input.recommendations || [],
    availability: input.availability || "unavailable",
    asOf: input.asOf || null,
    provenance: input.provenance || ["business_intelligence"],
  };
}

export function validateGuidedResult(result) {
  const errors = [];
  const allowedFields = new Set([
    "questionId",
    "handlerId",
    "resultType",
    "facts",
    "calculations",
    "recommendations",
    "availability",
    "asOf",
    "provenance",
  ]);

  if (!isPlainObject(result)) {
    return {
      valid: false,
      errors: ["Result must be a plain object."],
    };
  }

  Object.keys(result).forEach((key) => {
    if (!allowedFields.has(key)) {
      errors.push(`Unexpected result field: ${key}.`);
    }
  });

  if (typeof result.questionId !== "string" || !result.questionId.trim()) {
    errors.push("questionId is required.");
  }

  if (typeof result.handlerId !== "string" || !result.handlerId.trim()) {
    errors.push("handlerId is required.");
  } else if (!getGuidedHandler(result.handlerId)) {
    errors.push(`Unknown handlerId: ${result.handlerId}.`);
  }

  if (typeof result.resultType !== "string" || !result.resultType.trim()) {
    errors.push("resultType is required.");
  }

  if (!isPlainObject(result.facts)) {
    errors.push("facts must be a plain object.");
  } else if (!isSafeValue(result.facts)) {
    errors.push("facts must contain safe serializable values.");
  }

  if (!Array.isArray(result.calculations)) {
    errors.push("calculations must be an array.");
  } else if (
    result.calculations.some(
      (item) =>
        !isPlainObject(item) ||
        !isSafeValue(item) ||
        containsUnsafeField(item)
    )
  ) {
    errors.push("calculations must contain safe plain objects.");
  }

  if (!Array.isArray(result.recommendations)) {
    errors.push("recommendations must be an array.");
  } else if (
    result.recommendations.some(
      (item) =>
        !isPlainObject(item) ||
        !isSafeValue(item) ||
        containsUnsafeField(item)
    )
  ) {
    errors.push("recommendations must contain safe plain objects.");
  }

  if (!AVAILABILITY_STATES.includes(result.availability)) {
    errors.push(`Invalid availability: ${result.availability}.`);
  }

  if (result.asOf !== null && typeof result.asOf !== "string") {
    errors.push("asOf must be null or a string.");
  }

  if (
    !Array.isArray(result.provenance) ||
    result.provenance.some((item) => typeof item !== "string")
  ) {
    errors.push("provenance must be an array of strings.");
  }

  if (containsUnsafeField(result)) {
    errors.push("Result contains an unsafe field.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export const GUIDED_HANDLER_IDS = Object.freeze(
  Object.keys(GUIDED_HANDLERS)
);
