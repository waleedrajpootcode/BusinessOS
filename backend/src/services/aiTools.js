const {
  createAuthenticatedSupabaseClient,
} = require("./supabaseClient");

/* -------------------------------------------------------
   SALES
------------------------------------------------------- */

async function getSalesOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("sales")
    .select("total, profit");

  if (error) {
    console.error(
      "BusinessOS AI Sales Tool Error:",
      error
    );

    throw new Error(
      "Sales information could not be retrieved."
    );
  }

  const sales = Array.isArray(data) ? data : [];

  const totalSales = sales.length;

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.total || 0),
    0
  );

  const totalProfit = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.profit || 0),
    0
  );

  return {
    totalSales,
    totalRevenue,
    totalProfit,
    availability: sales.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   EXPENSES
------------------------------------------------------- */

async function getExpenseOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("expenses")
    .select("amount");

  if (error) {
    console.error(
      "BusinessOS AI Expense Tool Error:",
      error
    );

    throw new Error(
      "Expense information could not be retrieved."
    );
  }

  const expenses = Array.isArray(data)
    ? data
    : [];

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  return {
    totalExpenseRecords: expenses.length,
    totalExpenses,
    availability: expenses.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   PROFIT
------------------------------------------------------- */

async function getProfitOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("sales")
    .select("profit");

  if (error) {
    console.error(
      "BusinessOS AI Profit Tool Error:",
      error
    );

    throw new Error(
      "Profit information could not be retrieved."
    );
  }

  const sales = Array.isArray(data)
    ? data
    : [];

  const salesProfit = sales.reduce(
    (sum, sale) =>
      sum + Number(sale.profit || 0),
    0
  );

  return {
    salesCount: sales.length,
    salesProfit,
    availability: sales.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   INVENTORY
------------------------------------------------------- */

async function getInventoryOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, product_name, stock, minimum_stock, price"
    );

  if (error) {
    console.error(
      "BusinessOS AI Inventory Tool Error:",
      error
    );

    throw new Error(
      "Inventory information could not be retrieved."
    );
  }

  const products = Array.isArray(data)
    ? data
    : [];

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) <=
      Number(product.minimum_stock || 0)
  );

  const totalStockUnits = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  return {
    totalProducts: products.length,
    totalStockUnits,
    lowStockCount: lowStockProducts.length,
    availability: products.length > 0 ? "available" : "missing",
    lowStockProducts: lowStockProducts
      .slice(0, 20)
      .map((product) => ({
        id: product.id,
        productName: product.product_name,
        stock: Number(product.stock || 0),
        minimumStock: Number(
          product.minimum_stock || 0
        ),
      })),
  };
}


/* -------------------------------------------------------
   CUSTOMERS
------------------------------------------------------- */

async function getCustomerOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name");

  if (error) {
    console.error(
      "BusinessOS AI Customer Tool Error:",
      error
    );

    throw new Error(
      "Customer information could not be retrieved."
    );
  }

  const customers = Array.isArray(data)
    ? data
    : [];

  return {
    totalCustomers: customers.length,
    availability: customers.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   CUSTOMER PAYMENTS
------------------------------------------------------- */

async function getCustomerPaymentOverview(
  accessToken
) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("customer_payment_summary")
    .select(
      "invoice_total, total_paid, outstanding, payment_status"
    );

  if (error) {
    console.error(
      "BusinessOS AI Customer Payment Tool Error:",
      error
    );

    throw new Error(
      "Customer payment information could not be retrieved."
    );
  }

  const payments = Array.isArray(data)
    ? data
    : [];

  const totalInvoiceValue = payments.reduce(
    (sum, item) =>
      sum + Number(item.invoice_total || 0),
    0
  );

  const totalPaid = payments.reduce(
    (sum, item) =>
      sum + Number(item.total_paid || 0),
    0
  );

  const totalOutstanding = payments.reduce(
    (sum, item) =>
      sum + Number(item.outstanding || 0),
    0
  );

  const outstandingAccounts =
    payments.filter(
      (item) =>
        Number(item.outstanding || 0) > 0
    ).length;

  return {
    totalAccounts: payments.length,
    totalInvoiceValue,
    totalPaid,
    totalOutstanding,
    outstandingAccounts,
    availability: payments.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   SUPPLIERS
------------------------------------------------------- */

async function getSupplierOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("purchases")
    .select("supplier_id");

  if (error) {
    console.error(
      "BusinessOS AI Supplier Tool Error:",
      error
    );

    throw new Error(
      "Supplier information could not be retrieved."
    );
  }

  const purchases = Array.isArray(data)
    ? data
    : [];

  const supplierIds = new Set(
    purchases
      .map((purchase) => purchase.supplier_id)
      .filter(Boolean)
  );

  return {
    totalSuppliersReferenced:
      supplierIds.size,
    totalPurchasesWithSupplier:
      purchases.length,
    availability: purchases.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   PURCHASES
------------------------------------------------------- */

async function getPurchaseOverview(accessToken) {
  const supabase =
    createAuthenticatedSupabaseClient(accessToken);

  const { data, error } = await supabase
    .from("purchases")
    .select("total");

  if (error) {
    console.error(
      "BusinessOS AI Purchase Tool Error:",
      error
    );

    throw new Error(
      "Purchase information could not be retrieved."
    );
  }

  const purchases = Array.isArray(data)
    ? data
    : [];

  const totalPurchases = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.total || 0),
    0
  );

  return {
    totalPurchaseRecords: purchases.length,
    totalPurchases,
    availability: purchases.length > 0 ? "available" : "missing",
  };
}


/* -------------------------------------------------------
   BUSINESS SNAPSHOT
------------------------------------------------------- */

async function getBusinessSnapshot(accessToken) {
  const [
    sales,
    expenses,
    profit,
    inventory,
    customers,
    customerPayments,
    purchases,
  ] = await Promise.all([
    getSalesOverview(accessToken),
    getExpenseOverview(accessToken),
    getProfitOverview(accessToken),
    getInventoryOverview(accessToken),
    getCustomerOverview(accessToken),
    getCustomerPaymentOverview(accessToken),
    getPurchaseOverview(accessToken),
  ]);

  const netProfit =
    Number(profit?.salesProfit || 0) -
    Number(expenses?.totalExpenses || 0);

  return {
    metadata: {
      asOf: new Date().toISOString(),
      coverage: "all_available_records",
      completeness: "complete",
      provenance: ["business_snapshot"],
    },
    sales,
    expenses,
    profit: {
      ...profit,
      netProfit,
      calculations: {
        netProfit: {
          value: netProfit,
          availability:
            profit?.availability === "available" &&
            expenses?.availability === "available"
              ? "available"
              : "unavailable",
          valueType: "calculated",
          calculation: "salesProfit - totalExpenses",
        },
      },
    },
    inventory,
    customers,
    customerPayments,
    purchases,
  };
}

/* -------------------------------------------------------
   CANONICAL AI TOOL REGISTRY
------------------------------------------------------- */

const AI_TOOL_REGISTRY = Object.freeze({
  business_snapshot: Object.freeze({
    id: "business_snapshot",
    access: "read",
    input: {
      required: ["userId", "businessId", "accessToken"],
    },
    output: {
      type: "aggregate_snapshot",
      rawRowsExposed: false,
      maxLowStockProducts: 20,
      note: "Source reads remain full-result aggregations until the separate performance task.",
    },
    execute: getBusinessSnapshot,
  }),
});

function getAiTool(toolId) {
  const tool = AI_TOOL_REGISTRY[toolId];

  if (!tool || tool.access !== "read" || typeof tool.execute !== "function") {
    return null;
  }

  return tool;
}

function validateAiToolContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return {
      valid: false,
      code: "AI_CONTEXT_REQUIRED",
      message: "Authenticated AI context is required.",
    };
  }

  for (const field of ["userId", "businessId", "accessToken"]) {
    if (typeof context[field] !== "string" || !context[field].trim()) {
      return {
        valid: false,
        code: "AI_CONTEXT_INVALID",
        message: "Authenticated AI context is invalid.",
      };
    }
  }

  return { valid: true };
}

async function executeAiTool(toolId, context) {
  const tool = getAiTool(toolId);

  if (!tool) {
    return {
      success: false,
      code: "AI_TOOL_NOT_ALLOWED",
      message: "The requested AI tool is not allowed.",
    };
  }

  const contextValidation = validateAiToolContext(context);

  if (!contextValidation.valid) {
    return {
      success: false,
      ...contextValidation,
    };
  }

  const data = await tool.execute(context.accessToken);

  return {
    success: true,
    toolId: tool.id,
    data,
  };
}


/* -------------------------------------------------------
   EXPORTS
------------------------------------------------------- */

module.exports = {
  getSalesOverview,
  getExpenseOverview,
  getProfitOverview,
  getInventoryOverview,
  getCustomerOverview,
  getCustomerPaymentOverview,
  getSupplierOverview,
  getPurchaseOverview,
  getBusinessSnapshot,
  AI_TOOL_REGISTRY,
  getAiTool,
  validateAiToolContext,
  executeAiTool,
};
