import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowUp,
  Bot,
  LoaderCircle,
  MessageCircle,
  Mic,
  Sparkles,
  X,
} from "lucide-react";

import { askBusinessQuestion } from "../../services/ai/aiService";

function AIAssistantWidget() {
    const location = useLocation();
      function getPageContext(pathname) {
    if (pathname === "/dashboard") {
      return {
        page: "dashboard",
        label: "Dashboard",
      };
    }

    if (pathname === "/ai-advisor") {
      return {
        page: "ai-advisor",
        label: "AI Advisor",
      };
    }

    if (pathname === "/products") {
      return {
        page: "products",
        label: "Products",
      };
    }

    if (pathname === "/customers") {
      return {
        page: "customers",
        label: "Customers",
      };
    }

    if (pathname.startsWith("/customer-ledger/")) {
      return {
        page: "customer-ledger",
        label: "Customer Ledger",
      };
    }

    if (pathname === "/sales") {
      return {
        page: "sales",
        label: "Sales",
      };
    }

    if (pathname === "/suppliers") {
      return {
        page: "suppliers",
        label: "Suppliers",
      };
    }

    if (pathname.startsWith("/supplier-ledger/")) {
      return {
        page: "supplier-ledger",
        label: "Supplier Ledger",
      };
    }

    if (pathname === "/purchases") {
      return {
        page: "purchases",
        label: "Purchases",
      };
    }

    if (pathname.startsWith("/purchases/")) {
      return {
        page: "purchase-details",
        label: "Purchase",
      };
    }

    if (pathname === "/inventory") {
      return {
        page: "inventory",
        label: "Inventory",
      };
    }

    if (pathname === "/expenses") {
      return {
        page: "expenses",
        label: "Expenses",
      };
    }

    if (pathname === "/reports") {
      return {
        page: "reports",
        label: "Reports",
      };
    }

    if (pathname === "/users") {
      return {
        page: "users",
        label: "Users",
      };
    }

    if (pathname === "/employees") {
      return {
        page: "employees",
        label: "Employees",
      };
    }

    if (pathname === "/business-settings") {
      return {
        page: "business-settings",
        label: "Business Settings",
      };
    }

    if (pathname === "/business-setup") {
      return {
        page: "business-setup",
        label: "Business Setup",
      };
    }

    return {
      page: "business",
      label: "BusinessOS",
    };
  }

  const pageContext = getPageContext(location.pathname);

    const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function submitBusinessQuestion(rawQuestion) {
    const trimmedQuestion = String(rawQuestion || "").trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setQuestion("");

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `${Date.now()}-user`,
        role: "user",
        message: trimmedQuestion,
      },
    ]);

    setLoading(true);

    try {
      const response = await askBusinessQuestion(trimmedQuestion);

      if (!response?.success || !response?.data?.answer) {
        throw new Error("BusinessOS AI could not prepare an answer.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          message: response.data.answer,
          success: true,
          data: response,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          message:
            "I could not answer that right now. Please try again.",
          success: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitBusinessQuestion(question);
  }

  function handleQuickQuestion(value) {
    setQuestion(value);
  }

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open BusinessOS AI Assistant"
          className="
            fixed bottom-5 right-5 z-50
            flex h-14 w-14 items-center justify-center
            rounded-2xl
            border border-indigo-400/30
            bg-slate-950
            text-white
            shadow-[0_12px_40px_rgba(15,23,42,0.28)]
            transition-all duration-300
            hover:-translate-y-1
            hover:scale-105
            hover:border-indigo-300/60
            hover:shadow-[0_16px_45px_rgba(79,70,229,0.28)]
            active:scale-95
            sm:bottom-6 sm:right-6
          "
        >
          <span
            className="
              absolute inset-0 rounded-2xl
              bg-indigo-500/20
              animate-pulse
            "
          />

          <span
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-indigo-500 to-cyan-400
            "
          >
            <Sparkles size={20} strokeWidth={2.2} />
          </span>
        </button>
      )}

      {/* AI Chat Window */}
      {isOpen && (
        <div
          className="
            fixed z-50
            bottom-4 right-4
            flex
            h-[min(680px,calc(100vh-32px))]
            w-[min(420px,calc(100vw-32px))]
            flex-col
            overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-[0_24px_80px_rgba(15,23,42,0.22)]
            animate-[aiWidgetIn_220ms_ease-out]
            sm:bottom-6 sm:right-6
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              border-b border-slate-200
              bg-slate-950
              px-5 py-4
              text-white
            "
          >
            <div
              className="
                pointer-events-none absolute
                -right-12 -top-16
                h-40 w-40
                rounded-full
                bg-indigo-500/20
                blur-3xl
              "
            />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br from-indigo-500 to-cyan-400
                    shadow-lg shadow-indigo-500/20
                  "
                >
                  <Bot size={22} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold sm:text-base">
                      BusinessOS AI
                    </h2>

                    <span
                      className="
                        flex items-center gap-1
                        rounded-full
                        bg-emerald-400/10
                        px-2 py-0.5
                        text-[10px] font-medium
                        text-emerald-300
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Ready
                    </span>
                  </div>

<div className="mt-0.5 flex items-center gap-1.5">
  <p className="text-xs text-slate-400">
    Your business assistant
  </p>

  <span className="text-slate-600">•</span>

  <span className="truncate text-[10px] font-medium text-cyan-300">
    {pageContext.label}
  </span>
</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close BusinessOS AI Assistant"
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  text-slate-400
                  transition-all duration-200
                  hover:bg-white/10
                  hover:text-white
                  active:scale-95
                "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-5">
            {messages.length === 0 ? (
              <>
                <div className="flex gap-3">
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-indigo-100
                      text-indigo-600
                    "
                  >
                    <Sparkles size={17} />
                  </div>

                  <div
                    className="
                      max-w-[85%]
                      rounded-2xl rounded-tl-md
                      border border-slate-200
                      bg-white
                      px-4 py-3
                      shadow-sm
                    "
                  >
                    <p className="text-sm leading-6 text-slate-700">
                      Hi! 👋 I&apos;m your BusinessOS AI assistant.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Ask me about your sales, profit, expenses, stock,
                      customers or payments.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Try asking
                  </p>

                  <div className="space-y-2">
                    {[
  ...(pageContext.page === "supplier-ledger"
    ? ["Is supplier ko kitni payment deni hai?"]
    : []),

  ...(pageContext.page === "customer-ledger"
    ? ["Is customer ka outstanding kitna hai?"]
    : []),

  ...(pageContext.page === "inventory"
    ? ["Stock mein kya kam hai?"]
    : []),

  ...(pageContext.page === "sales"
    ? ["Meri sales kaisi hain?"]
    : []),

  "Mera profit kitna hai?",
  "Meri dukaan kaisi chal rahi hai?",
]
  .slice(0, 4)
  .map((item) => (
    <button
      key={item}
      type="button"
      onClick={() => handleQuickQuestion(item)}
      className="
        flex w-full items-center gap-3
        rounded-xl
        border border-slate-200
        bg-white
        px-3.5 py-3
        text-left text-sm
        text-slate-600
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:bg-indigo-50/60
        hover:text-indigo-700
      "
    >
      <MessageCircle
        size={15}
        className="shrink-0 text-indigo-500"
      />

      <span className="min-w-0 flex-1">
        {item}
      </span>

      <ArrowUp
        size={14}
        className="shrink-0 rotate-45 text-slate-300"
      />
    </button>
  ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 ${
                      item.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {item.role === "assistant" && (
                      <div
                        className="
                          flex h-8 w-8 shrink-0
                          items-center justify-center
                          rounded-xl
                          bg-indigo-100
                          text-indigo-600
                        "
                      >
                        <Sparkles size={15} />
                      </div>
                    )}

                    <div
                      className={`
                        max-w-[82%]
                        rounded-2xl
                        px-4 py-3
                        text-sm leading-6
                        ${
                          item.role === "user"
                            ? "rounded-br-md bg-slate-950 text-white"
                            : item.success === false
                              ? "rounded-tl-md border border-rose-200 bg-rose-50 text-rose-700"
                              : "rounded-tl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                        }
                      `}
                    >
                      {item.message}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div
                      className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-indigo-100
                        text-indigo-600
                      "
                    >
                      <Sparkles size={15} />
                    </div>

                    <div
                      className="
                        flex items-center gap-2
                        rounded-2xl rounded-tl-md
                        border border-slate-200
                        bg-white
                        px-4 py-3
                        shadow-sm
                      "
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                        style={{ animationDelay: "240ms" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <form onSubmit={handleSubmit}>
              <div
                className="
                  flex items-center gap-2
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  p-2
                  transition-all duration-200
                  focus-within:border-indigo-300
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-indigo-500/10
                "
              >
                <input
                  type="text"
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  disabled={loading}
                  placeholder="Ask your business anything..."
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    px-2
                    py-2
                    text-sm
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  aria-label="Voice input"
                  title="Voice input coming soon"
                  className="
                    hidden h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    text-slate-400
                    transition-colors
                    hover:bg-slate-200
                    hover:text-slate-700
                    sm:flex
                  "
                >
                  <Mic size={17} />
                </button>

                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  aria-label="Send question"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-slate-950
                    text-white
                    transition-all duration-200
                    hover:bg-indigo-600
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  {loading ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowUp
                      size={17}
                      strokeWidth={2.4}
                    />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-[10px] text-slate-400">
                BusinessOS AI provides insights from your business data.
              </p>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes aiWidgetIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
}

export default AIAssistantWidget;