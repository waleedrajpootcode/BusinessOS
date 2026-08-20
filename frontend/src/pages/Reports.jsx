import { useEffect, useState } from "react";

import RevenueChart from "../components/reports/RevenueChart";
import TopSellingProducts from "../components/reports/TopSellingProducts";
import LowStockProducts from "../components/reports/LowStockProducts";
import TopCustomers from "../components/reports/TopCustomers";
import SalesTrendChart from "../components/reports/SalesTrendChart";

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
} from "../services/reports";

import StatsCard from "../components/dashboard/cards/StatsCard";

function Reports() {
  const [revenue, setRevenue] = useState(0);
  const [salesProfit, setSalesProfit] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [profit, setProfit] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);

  const [receivablesSummary, setReceivablesSummary] = useState({
    totalReceivable: 0,
    totalCollected: 0,
    customersWithDue: 0,
  });

  const [customerReceivables, setCustomerReceivables] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setRevenue(await getTotalRevenue());

    setSalesProfit(
      await getTotalSalesProfit()
    );

    setPurchases(
      await getTotalPurchases()
    );

    setExpenses(
      await getTotalExpenses()
    );

    setProfit(
      await getNetProfit()
    );

    setRevenueData(
      await getMonthlyRevenue()
    );

    setTopProducts(
      await getTopSellingProducts()
    );

    setLowStockProducts(
      await getLowStockProducts()
    );

    setTopCustomers(
      await getTopCustomers()
    );

    setSalesTrend(
      await getMonthlySalesCount()
    );

    setReceivablesSummary(
      await getReceivablesSummary()
    );

    setCustomerReceivables(
      await getCustomerReceivables()
    );
  }

  return (
    <div className="p-4 sm:p-6 min-w-0 w-full">

      {/* =========================
          HEADER
      ========================== */}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Reports
        </h1>

        <p className="text-gray-500 mt-2">
          Business Analytics Dashboard
        </p>
      </div>


      {/* =========================
          MAIN SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">

        <StatsCard
          title="Revenue"
          value={`PKR ${revenue.toLocaleString()}`}
        />

        <StatsCard
          title="Sales Profit"
          value={`PKR ${salesProfit.toLocaleString()}`}
        />

        <StatsCard
          title="Purchases"
          value={`PKR ${purchases.toLocaleString()}`}
        />

        <StatsCard
          title="Expenses"
          value={`PKR ${expenses.toLocaleString()}`}
        />

        <StatsCard
          title="Net Profit"
          value={`PKR ${profit.toLocaleString()}`}
        />

      </div>


      {/* =========================
          CUSTOMER RECEIVABLES
      ========================== */}

      <div className="mt-8">

        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">
            Customer Receivables
          </h2>

          <p className="text-gray-500 mt-1">
            Money due from customers and collected payments.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

          <StatsCard
            title="Total Receivable"
            value={`PKR ${Number(
              receivablesSummary.totalReceivable || 0
            ).toLocaleString()}`}
          />

          <StatsCard
            title="Total Collected"
            value={`PKR ${Number(
              receivablesSummary.totalCollected || 0
            ).toLocaleString()}`}
          />

          <StatsCard
            title="Customers With Due"
            value={Number(
              receivablesSummary.customersWithDue || 0
            ).toLocaleString()}
          />

        </div>

      </div>


      {/* =========================
          CUSTOMER-WISE RECEIVABLES
      ========================== */}

      <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden">

        <div className="p-4 sm:p-5 border-b">

          <h2 className="text-lg sm:text-xl font-bold">
            Customers With Outstanding Balance
          </h2>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Customers from whom payment is still due.
          </p>

        </div>


        {customerReceivables.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No outstanding customer payments.
          </div>

        ) : (

          <>
            {/* =========================
                DESKTOP / TABLET
            ========================== */}

            <div className="hidden md:block w-full overflow-hidden">

              <table className="w-full table-fixed">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Customer
                    </th>

                    <th className="p-4 text-right">
                      Total Sales
                    </th>

                    <th className="p-4 text-right">
                      Paid
                    </th>

                    <th className="p-4 text-right">
                      Outstanding
                    </th>

                    <th className="p-4 text-center">
                      Invoices
                    </th>

                    <th className="p-4 text-center">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {customerReceivables.map((customer) => (

                    <tr
                      key={customer.customer_id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium break-words">
                        {customer.customer_name}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.total_sales || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4 text-right text-green-600 whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.total_paid || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4 text-right text-red-600 font-semibold whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.outstanding || 0
                        ).toLocaleString()}
                      </td>

                      <td className="p-4 text-center">
                        {Number(
                          customer.invoices || 0
                        )}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={
                            customer.status === "Paid"
                              ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                              : customer.status === "Partial"
                                ? "px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700"
                                : "px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                          }
                        >
                          {customer.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* =========================
                MOBILE CUSTOMER CARDS
            ========================== */}

            <div className="md:hidden divide-y">

              {customerReceivables.map((customer) => (

                <div
                  key={customer.customer_id}
                  className="p-4"
                >

                  {/* Customer Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-xs text-gray-500">
                        Customer
                      </p>

                      <h3 className="font-semibold text-lg break-words">
                        {customer.customer_name}
                      </h3>

                    </div>


                    <span
                      className={
                        customer.status === "Paid"
                          ? "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                          : customer.status === "Partial"
                            ? "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
                            : "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                      }
                    >
                      {customer.status}
                    </span>

                  </div>


                  {/* Customer Details */}

                  <div className="mt-4 space-y-3 text-sm">

                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">
                        Total Sales
                      </span>

                      <span className="font-medium text-right whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.total_sales || 0
                        ).toLocaleString()}
                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">
                        Paid
                      </span>

                      <span className="font-medium text-green-600 text-right whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.total_paid || 0
                        ).toLocaleString()}
                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">
                        Outstanding
                      </span>

                      <span className="font-semibold text-red-600 text-right whitespace-nowrap">
                        PKR{" "}
                        {Number(
                          customer.outstanding || 0
                        ).toLocaleString()}
                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">
                        Invoices
                      </span>

                      <span className="font-medium text-right">
                        {Number(
                          customer.invoices || 0
                        )}
                      </span>

                    </div>


                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">
                        Status
                      </span>

                      <span className="font-medium text-right">
                        {customer.status || "-"}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>


      {/* =========================
          REVENUE CHART
      ========================== */}

      <div className="mt-8 min-w-0 overflow-hidden">

        <RevenueChart
          data={revenueData}
        />

      </div>


      {/* =========================
          TOP SELLING PRODUCTS
      ========================== */}

      <div className="mt-8 min-w-0 overflow-hidden">

        <TopSellingProducts
          products={topProducts}
        />

      </div>


      {/* =========================
          LOW STOCK PRODUCTS
      ========================== */}

      <div className="mt-8 min-w-0 overflow-hidden">

        <LowStockProducts
          products={lowStockProducts}
        />

      </div>


      {/* =========================
          TOP CUSTOMERS
      ========================== */}

      <div className="mt-8 min-w-0 overflow-hidden">

        <TopCustomers
          customers={topCustomers}
        />

      </div>


      {/* =========================
          SALES TREND
      ========================== */}

      <div className="mt-8 min-w-0 overflow-hidden">

        <SalesTrendChart
          data={salesTrend}
        />

      </div>

    </div>
  );
}

export default Reports;
