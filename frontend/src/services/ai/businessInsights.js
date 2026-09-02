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
    revenue: Number(totalRevenue || 0),
    salesProfit: Number(totalSalesProfit || 0),
    purchases: Number(totalPurchases || 0),
    expenses: Number(totalExpenses || 0),
    netProfit: Number(netProfit || 0),

    receivables: {
      totalReceivable: Number(
        receivables?.totalReceivable || 0
      ),
      totalCollected: Number(
        receivables?.totalCollected || 0
      ),
      customersWithDue: Number(
        receivables?.customersWithDue || 0
      ),
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
    revenue: Number(revenue || 0),
    profit: Number(salesProfit || 0),

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
    totalExpenses: Number(expenses || 0),
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
    salesProfit: Number(salesProfit || 0),
    expenses: Number(expenses || 0),
    netProfit: Number(netProfit || 0),
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
    ? supplierPayments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      )
    : 0;

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
      totalReceivable: Number(
        receivables?.totalReceivable || 0
      ),

      totalCollected: Number(
        receivables?.totalCollected || 0
      ),

      customersWithDue: Number(
        receivables?.customersWithDue || 0
      ),
    },

    customerAccounts: Array.isArray(
      customerReceivables
    )
      ? customerReceivables
      : [],
  };
}