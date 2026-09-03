import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Lightbulb,
  Package,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

import { analyzeBusiness } from "../services/ai/aiAdvisor";
import { buildAdvisorResponse } from "../services/ai/advisorResponse";
import { routeBusinessQuery } from "../services/ai/queryRouter";
import { buildQueryResponse } from "../services/ai/queryResponse";


function AIAdvisor() {
  const [response, setResponse] = useState(null);

  const [question, setQuestion] = useState("");
  const [queryResponse, setQueryResponse] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);

  const [conversation, setConversation] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);


  /* ===========================
     Business Advisor
  =========================== */

  async function loadAdvisor() {
    try {
      setLoading(true);
      setError("");

      const advisor = await analyzeBusiness();

      const advisorResponse =
        buildAdvisorResponse(advisor);

      if (!advisorResponse?.success) {
        throw new Error(
          "Business analysis could not be prepared."
        );
      }

      setResponse(advisorResponse);
    } catch (err) {
      console.error(
        "AI Advisor Page Error:",
        err
      );

      setError(
        "I could not load the business analysis right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  /* ===========================
     Ask BusinessOS
  =========================== */

  async function handleAskQuestion(event) {
    event.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      setQueryResponse({
        success: false,
        message:
          "Please enter a business question first.",
      });

      return;
    }


    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      message: trimmedQuestion,
    };


    setConversation((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setQueryResponse(null);
    setQueryLoading(true);


    try {
      const result =
        await routeBusinessQuery(
          trimmedQuestion
        );

      const formattedResponse =
        buildQueryResponse(result);

      setQueryResponse(
        formattedResponse
      );


      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        message:
          formattedResponse?.message ||
          "I could not prepare an answer right now.",
        success:
          formattedResponse?.success ?? false,
      };


      setConversation((current) => [
        ...current,
        assistantMessage,
      ]);

    } catch (err) {
      console.error(
        "AI Business Question Error:",
        err
      );

      const errorResponse = {
        success: false,
        message:
          "I could not answer that question right now. Please try again.",
      };

      setQueryResponse(
        errorResponse
      );


      setConversation((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          message: errorResponse.message,
          success: false,
        },
      ]);

    } finally {
      setQueryLoading(false);
    }
  }


  /* ===========================
     Quick Question
  =========================== */

  function askQuickQuestion(value) {
    setQuestion(value);
  }


  /* ===========================
     Auto Scroll Chat
  =========================== */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation, queryLoading]);


  /* ===========================
     Initial Load
  =========================== */

  useEffect(() => {
    loadAdvisor();
  }, []);


  /* ===========================
     Loading
  =========================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">

          <div className="text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
              <Sparkles
                size={24}
                className="text-white"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Preparing your BusinessOS AI
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              BusinessOS is securely preparing your
              business insights.
            </p>

          </div>

        </div>
      </div>
    );
  }


  /* ===========================
     Error
  =========================== */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">

          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Sparkles
                size={24}
                className="text-slate-600"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              BusinessOS AI is unavailable
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadAdvisor}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  const healthMessage =
    response?.sections?.find(
      (section) =>
        section.type === "health"
    )?.message ||
    "Business health information is currently unavailable.";


  const financialMessage =
    response?.sections?.find(
      (section) =>
        section.type === "financial"
    )?.message ||
    "";


  const paymentMessage =
    response?.sections?.find(
      (section) =>
        section.type === "payments"
    )?.message ||
    "";


  const inventoryMessage =
    response?.sections?.find(
      (section) =>
        section.type === "inventory"
    )?.message ||
    "";


  const supplierMessage =
    response?.sections?.find(
      (section) =>
        section.type === "suppliers"
    )?.message ||
    "";


  /* ===========================
     KPI Data
  =========================== */

  const revenue =
    Number(
      response?.summary?.revenue || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });


  const profit =
    Number(
      response?.summary?.netProfit || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });


  const expenses =
    Number(
      response?.summary?.expenses || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });


  const receivable =
    Number(
      response?.summary?.receivables?.totalReceivable || 0
    ).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });


  /* ===========================
     Quick Questions
  =========================== */

  const quickQuestions = [
    {
      label: "Business Health",
      question:
        "Meri dukaan kaisi chal rahi hai?",
      icon: TrendingUp,
    },
    {
      label: "Profit",
      question:
        "Mera profit kitna hai?",
      icon: CircleDollarSign,
    },
    {
      label: "Sales",
      question:
        "Meri sales kaisi hain?",
      icon: WalletCards,
    },
    {
      label: "Stock",
      question:
        "Stock mein kya kam hai?",
      icon: Package,
    },
    {
      label: "Customer Due",
      question:
        "Customers se kitni payment leni hai?",
      icon: CreditCard,
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">

      <div className="mx-auto max-w-7xl">


        {/* =====================================================
            AI COMMAND CENTER HEADER
        ===================================================== */}

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 shadow-md sm:h-14 sm:w-14">

                <Sparkles
                  size={23}
                  className="text-white"
                />

              </div>


              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    BusinessOS AI
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Ready

                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Your intelligent business partner
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={loadAdvisor}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              <RefreshCw size={16} />
              Refresh Insights
            </button>

          </div>

        </div>


        {/* =====================================================
            MAIN AI WORKSPACE
        ===================================================== */}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">


          {/* ===========================
              CHAT PANEL
          =========================== */}

          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Chat Header */}

            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">

                    <Sparkles
                      size={18}
                      className="text-slate-700"
                    />

                  </div>

                  <div>

                    <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                      Ask BusinessOS
                    </h2>

                    <p className="text-[11px] text-slate-500 sm:text-xs">
                      Ask questions in your own words
                    </p>

                  </div>

                </div>


                <div className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500 sm:flex">

                  <CheckCircle2 size={13} />

                  Read-only

                </div>

              </div>

            </div>


            {/* Chat Body */}

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

              {conversation.length === 0 ? (

                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">

                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 shadow-lg">

                    <Sparkles
                      size={27}
                      className="text-white"
                    />

                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    How can I help your business?
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Ask BusinessOS about sales, profit,
                    expenses, stock, customers or
                    payments.
                  </p>


                  <div className="mt-7 flex max-w-2xl flex-wrap justify-center gap-2">

                    {quickQuestions.map(
                      ({
                        label,
                        question: quickQuestion,
                        icon: Icon,
                      }) => (

                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            askQuickQuestion(
                              quickQuestion
                            )
                          }
                          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:text-sm"
                        >

                          <Icon
                            size={15}
                            className="text-slate-400 transition group-hover:text-slate-700"
                          />

                          {label}

                        </button>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="space-y-5">

                  {conversation.map(
                    (message) => {

                      const isUser =
                        message.role === "user";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-[88%] sm:max-w-[78%] ${
                              isUser
                                ? "rounded-2xl rounded-br-md bg-slate-900 text-white"
                                : "rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                            } px-4 py-3.5`}
                          >

                            <div
                              className={`mb-1.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider ${
                                isUser
                                  ? "text-slate-400"
                                  : "text-slate-400"
                              }`}
                            >

                              {!isUser && (
                                <Sparkles size={12} />
                              )}

                              {isUser
                                ? "You"
                                : "BusinessOS"}

                            </div>


                            <p className="text-sm leading-6">
                              {message.message}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}


                  {queryLoading && (

                    <div className="flex justify-start">

                      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3.5">

                        <div className="flex items-center gap-2">

                          <Sparkles
                            size={14}
                            className="text-slate-500"
                          />

                          <div className="flex items-center gap-1">

                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                            <span
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                              style={{
                                animationDelay:
                                  "120ms",
                              }}
                            />

                            <span
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                              style={{
                                animationDelay:
                                  "240ms",
                              }}
                            />

                          </div>

                          <span className="text-xs text-slate-500">
                            Analyzing...
                          </span>

                        </div>

                      </div>

                    </div>

                  )}

                  <div ref={chatEndRef} />

                </div>

              )}

            </div>


            {/* Composer */}

            <div className="border-t border-slate-100 bg-white p-3 sm:p-4">

              <form
                onSubmit={handleAskQuestion}
                className="relative"
              >

                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-inner transition focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm">

                  <input
                    type="text"
                    value={question}
                    onChange={(event) =>
                      setQuestion(
                        event.target.value
                      )
                    }
                    placeholder="Ask BusinessOS anything..."
                    disabled={queryLoading}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
                  />


                  <button
                    type="submit"
                    disabled={queryLoading}
                    aria-label="Send question"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {queryLoading ? (
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowUp size={18} />
                    )}

                  </button>

                </div>

              </form>


              <div className="mt-2 flex items-center justify-between px-1">

                <p className="text-[10px] text-slate-400 sm:text-[11px]">
                  BusinessOS uses available business data only.
                </p>

                <div className="hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">

                  <Clock3 size={11} />

                  Read-only analysis

                </div>

              </div>

            </div>

          </section>


          {/* ===========================
              BUSINESS SNAPSHOT
          =========================== */}

          <aside className="space-y-5">


            {/* Health Card */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Business Health
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {response?.headline ||
                      "Business Analysis"}
                  </h2>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">

                  <TrendingUp
                    size={17}
                    className="text-slate-700"
                  />

                </div>

              </div>


              <p className="mt-3 text-xs leading-5 text-slate-500">
                {healthMessage}
              </p>

            </div>


            {/* KPI Stack */}

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-slate-400">

                  <CircleDollarSign size={15} />

                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Revenue
                  </span>

                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  PKR {revenue}
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-slate-400">

                  <TrendingUp size={15} />

                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Net Profit
                  </span>

                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  PKR {profit}
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-slate-400">

                  <WalletCards size={15} />

                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Expenses
                  </span>

                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  PKR {expenses}
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex items-center gap-2 text-slate-400">

                  <CreditCard size={15} />

                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Customer Due
                  </span>

                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  PKR {receivable}
                </p>

              </div>

            </div>


            {/* Attention */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-2">

                <Lightbulb
                  size={17}
                  className="text-slate-700"
                />

                <h3 className="text-sm font-bold text-slate-900">
                  What needs attention?
                </h3>

              </div>


              <div className="mt-4 space-y-3">

                <div className="rounded-xl bg-slate-50 p-3">

                  <div className="flex items-start gap-2.5">

                    <CreditCard
                      size={15}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <p className="text-xs leading-5 text-slate-600">
                      {paymentMessage ||
                        "Customer payment information is currently unavailable."}
                    </p>

                  </div>

                </div>


                <div className="rounded-xl bg-slate-50 p-3">

                  <div className="flex items-start gap-2.5">

                    <Package
                      size={15}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <p className="text-xs leading-5 text-slate-600">
                      {inventoryMessage ||
                        "Inventory information is currently unavailable."}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>


        {/* =====================================================
            BUSINESS INTELLIGENCE
        ===================================================== */}

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Intelligence Overview
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                Your business at a glance
              </h2>

            </div>

            <p className="text-xs text-slate-400">
              Based on available BusinessOS data
            </p>

          </div>


          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">


            {/* Financial */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

                  <CircleDollarSign
                    size={15}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Financial Position
                </h3>

              </div>

              <p className="text-xs leading-5 text-slate-600">
                {financialMessage}
              </p>

            </div>


            {/* Payments */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

                  <Users
                    size={15}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Customer Payments
                </h3>

              </div>

              <p className="text-xs leading-5 text-slate-600">
                {paymentMessage}
              </p>

            </div>


            {/* Inventory */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

                  <Package
                    size={15}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Inventory
                </h3>

              </div>

              <p className="text-xs leading-5 text-slate-600">
                {inventoryMessage}
              </p>

            </div>


            {/* Suppliers */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

                  <Users
                    size={15}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Suppliers
                </h3>

              </div>

              <p className="text-xs leading-5 text-slate-600">
                {supplierMessage}
              </p>

            </div>


            {/* Recommendations */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2 lg:col-span-2">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">

                  <Lightbulb
                    size={15}
                    className="text-slate-600"
                  />

                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Recommended Actions
                </h3>

              </div>


              {Array.isArray(
                response?.recommendations
              ) &&
              response.recommendations.length > 0 ? (

                <div className="grid gap-2 sm:grid-cols-2">

                  {response.recommendations.map(
                    (recommendation, index) => (

                      <div
                        key={`${recommendation}-${index}`}
                        className="rounded-xl bg-white p-3"
                      >

                        <p className="text-xs leading-5 text-slate-600">
                          {recommendation}
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-xs text-slate-500">
                  No immediate recommendations are available.
                </p>

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            SAFETY FOOTER
        ===================================================== */}

        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <CheckCircle2 size={13} />

            <span>
              BusinessOS AI currently provides read-only analysis.
            </span>

          </div>

          <span>
            No sales, purchases, payments or stock changes are executed.
          </span>

        </div>

      </div>

    </div>
  );
}


export default AIAdvisor;