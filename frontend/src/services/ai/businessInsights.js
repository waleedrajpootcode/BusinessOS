import {
  getTotalRevenue,
  getTotalSalesProfit,
  getTotalPurchases,
  getTotalExpenses,
  getNetProfit,
  getMonthlyRevenue,
  getTopSellingProducts,
  getLowStockProducts,
  getTopCustomers,
  getMonthlySalesCount,
  getReceivablesSummary,
  getCustomerReceivables,
} from "../reports";

import { getSuppliers } from "../suppliers";
import { getAllSupplierPayments } from "../supplierPayments";

export function normalizeMetric(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function sumMetrics(values) {
  const normalizedValues = values.map(normalizeMetric);
  return normalizedValues.some((value) => value === null)
    ? null
    : normalizedValues.reduce((sum, value) => sum + value, 0);
}

/**
 * BusinessOS AI Business Insights
 *
 * Day 5 foundation.
 *
 * IMPORTANT:
 * - Read-only only.
 * - Uses existing BusinessOS services.
 * - No database writes.
 * - No arbitrary SQL.
 * - No AI provider/API key here.
 */

/* ===========================
   Business Summary
=========================== */

export async function getBusinessSummary() {
  const [
    totalRevenue,
    totalSalesProfit,
    totalPurchases,
    totalExpenses,
    netProfit,
    receivables,
  ] = await Promise.all([
    getTotalRevenue(),
    getTotalSalesProfit(),
    getTotalPurchases(),
    getTotalExpenses(),
    getNetProfit(),
    getReceivablesSummary(),
  ]);

  return {
    revenue: normalizeMetric(totalRevenue),
    salesProfit: normalizeMetric(totalSalesProfit),
    purchases: normalizeMetric(totalPurchases),
    expenses: normalizeMetric(totalExpenses),
    netProfit: normalizeMetric(netProfit),

    receivables: {
      totalReceivable: normalizeMetric(receivables?.totalReceivable),
      totalCollected: normalizeMetric(receivables?.totalCollected),
      customersWithDue: normalizeMetric(receivables?.customersWithDue),
    },
  };
}


/* ===========================
   Sales Insights
=========================== */

export async function getSalesInsights() {
  const [
    revenue,
    salesProfit,
    monthlyRevenue,
    monthlySales,
    topProducts,
  ] = await Promise.all([
    getTotalRevenue(),
    getTotalSalesProfit(),
    getMonthlyRevenue(),
    getMonthlySalesCount(),
    getTopSellingProducts(),
  ]);

  return {
    revenue: normalizeMetric(revenue),
    profit: normalizeMetric(salesProfit),

    monthlyRevenue: Array.isArray(monthlyRevenue)
      ? monthlyRevenue
      : [],

    monthlySales: Array.isArray(monthlySales)
      ? monthlySales
      : [],

    topProducts: Array.isArray(topProducts)
      ? topProducts
      : [],
  };
}


/* ===========================
   Expense Insights
=========================== */

export async function getExpenseInsights() {
  const expenses = await getTotalExpenses();

  return {
    totalExpenses: normalizeMetric(expenses),
  };
}


/* ===========================
   Profit Insights
=========================== */

export async function getProfitInsights() {
  const [
    salesProfit,
    expenses,
    netProfit,
  ] = await Promise.all([
    getTotalSalesProfit(),
    getTotalExpenses(),
    getNetProfit(),
  ]);

  return {
    salesProfit: normalizeMetric(salesProfit),
    expenses: normalizeMetric(expenses),
    netProfit: normalizeMetric(netProfit),
  };
}


/* ===========================
   Inventory Insights
=========================== */

export async function getInventoryInsights() {
  const [
    lowStockProducts,
    topProducts,
  ] = await Promise.all([
    getLowStockProducts(),
    getTopSellingProducts(),
  ]);

  return {
    lowStockProducts: Array.isArray(lowStockProducts)
      ? lowStockProducts
      : [],

    topSellingProducts: Array.isArray(topProducts)
      ? topProducts
      : [],
  };
}


/* ===========================
   Customer Insights
=========================== */

export async function getCustomerInsights() {
  const [
    topCustomers,
    customerReceivables,
  ] = await Promise.all([
    getTopCustomers(),
    getCustomerReceivables(),
  ]);

  return {
    topCustomers: Array.isArray(topCustomers)
      ? topCustomers
      : [],

    customerReceivables: Array.isArray(
      customerReceivables
    )
      ? customerReceivables
      : [],
  };
}


/* ===========================
   Supplier Insights
=========================== */

export async function getSupplierInsights() {
  const [
    suppliers,
    supplierPayments,
  ] = await Promise.all([
    getSuppliers(),
    getAllSupplierPayments(),
  ]);

  const totalSuppliers = Array.isArray(suppliers)
    ? suppliers.length
    : 0;

  const totalPaid = Array.isArray(supplierPayments)
    ? sumMetrics(supplierPayments.map((payment) => payment?.amount))
    : null;

  return {
    totalSuppliers,
    totalPaid,
    recentPayments: Array.isArray(
      supplierPayments
    )
      ? supplierPayments.slice(0, 10)
      : [],
  };
}


/* ===========================
   Payment Insights
=========================== */

export async function getPaymentInsights() {
  const [
    receivables,
    customerReceivables,
  ] = await Promise.all([
    getReceivablesSummary(),
    getCustomerReceivables(),
  ]);

  return {
    customer: {
      totalReceivable: normalizeMetric(receivables?.totalReceivable),
      totalCollected: normalizeMetric(receivables?.totalCollected),
      customersWithDue: normalizeMetric(receivables?.customersWithDue),
    },

    customerAccounts: Array.isArray(
      customerReceivables
    )
      ? customerReceivables
      : [],
  };
}