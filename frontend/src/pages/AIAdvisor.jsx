import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Database,
  Gauge,
  Landmark,
  Lightbulb,
  LockKeyhole,
  Package,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
  Zap,
  Trash2,
} from "lucide-react";

import { analyzeBusiness } from "../services/ai/aiAdvisor";
import { buildAdvisorResponse } from "../services/ai/advisorResponse";
import { routeBusinessQuery } from "../services/ai/queryRouter";
import { buildQueryResponse } from "../services/ai/queryResponse";
import {
  AI_QUESTION_CATEGORIES,
  getQuestionsByCategory,
} from "../services/ai/questionLibrary";
import "../styles/AIAdvisor.css";

function getCategoryKey(category) {
  if (typeof category === "string") return category;
  return category?.id || category?.key || category?.value || "";
}

function getCategoryLabel(category) {
  if (typeof category === "string") {
    return category
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    category?.label ||
    category?.name ||
    category?.title ||
    category?.id ||
    "Questions"
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getQuestionIcon(category) {
  switch (category) {
    case "sales":
      return TrendingUp;
    case "profit":
      return CircleDollarSign;
    case "inventory":
      return Package;
    case "customers":
      return Users;
    case "payments":
      return CreditCard;
    case "expenses":
      return WalletCards;
    case "suppliers":
      return Truck;
    case "growth":
    case "strategy":
      return Lightbulb;
    default:
      return Sparkles;
  }
}

const CORE_NODES = [
  { label: "SALES", icon: TrendingUp, position: "node-top" },
  { label: "REVENUE", icon: CircleDollarSign, position: "node-top-right" },
  { label: "PROFIT", icon: BarChart3, position: "node-right" },
  { label: "CUSTOMERS", icon: Users, position: "node-bottom-right" },
  { label: "PAYMENTS", icon: CreditCard, position: "node-bottom" },
  { label: "CASH FLOW", icon: WalletCards, position: "node-bottom-left" },
  { label: "INVENTORY", icon: Package, position: "node-left-bottom" },
  { label: "SUPPLIERS", icon: Truck, position: "node-left" },
  { label: "EXPENSES", icon: Landmark, position: "node-left-top" },
  { label: "GROWTH", icon: Target, position: "node-upper-left" },
];

const SIGNALS = [
  {
    label: "REVENUE",
    status: "STRONG",
    icon: TrendingUp,
    tone: "positive",
    insight: "Revenue signal is being monitored from authorized records.",
  },
  {
    label: "PROFITABILITY",
    status: "HEALTHY",
    icon: CircleDollarSign,
    tone: "positive",
    insight: "Profit and expense relationships are within the current signal.",
  },
  {
    label: "EXPENSE PRESSURE",
    status: "STABLE",
    icon: WalletCards,
    tone: "neutral",
    insight: "Expense pressure is evaluated against current business activity.",
  },
  {
    label: "CUSTOMER OUTSTANDING",
    status: "WATCH",
    icon: CreditCard,
    tone: "watch",
    insight: "Receivables deserve attention because collection affects cash flow.",
  },
];

const INTELLIGENCE_MODULES = [
  { label: "FINANCIAL", icon: CircleDollarSign, description: "Revenue, profit, expenses and cash flow." },
  { label: "CUSTOMER", icon: Users, description: "Activity, outstanding balances and concentration." },
  { label: "INVENTORY", icon: Boxes, description: "Stock position, low stock and inventory risk." },
  { label: "SUPPLIER", icon: Truck, description: "Supplier balances, payments and activity." },
  { label: "GROWTH", icon: Target, description: "Growth, product, customer and operational opportunities." },
];

export default function AIAdvisor() {
  const [response, setResponse] = useState(null);
  const [question, setQuestion] = useState("");
  const [queryResponse, setQueryResponse] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [selectedQuestionCategory, setSelectedQuestionCategory] =
    useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);

  async function loadAdvisor() {
    try {
      setLoading(true);
      setError("");

      const advisor = await analyzeBusiness();
      const advisorResponse = buildAdvisorResponse(advisor);

      if (!advisorResponse?.success) {
        throw new Error("Business analysis could not be prepared.");
      }

      setResponse(advisorResponse);
    } catch (err) {
      console.error("AI Advisor Page Error:", err);
      setError(
        "I could not load the business analysis right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function askBusinessQuestion(value) {
    const trimmedQuestion = String(value || "").trim();

    if (!trimmedQuestion || queryLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedQuestion,
    };

    setConversation((current) => [...current, userMessage]);
    setQuestion("");
    setQueryResponse(null);
    setQueryLoading(true);

    try {
      // Existing BusinessOS pipeline stays the same:
      // route the question, build the response, then show the real answer in chat.
      const routedResult = await routeBusinessQuery(trimmedQuestion);
      const formattedResponse = buildQueryResponse(routedResult);

      setQueryResponse(formattedResponse);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          formattedResponse?.message ||
          formattedResponse?.answer ||
          "I could not prepare an answer for that question.",
        data: formattedResponse,
      };

      setConversation((current) => [...current, assistantMessage]);
    } catch (err) {
      console.error("AI Question Error:", err);

      setConversation((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "I could not answer that question right now. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setQueryLoading(false);
    }
  }

  async function handleAskQuestion(event) {
    event?.preventDefault();
    await askBusinessQuestion(question);
  }

  function askQuickQuestion(value) {
    // Clicking a suggested question sends it immediately to the same chat.
    void askBusinessQuestion(value);
  }

  function clearConversation() {
    setConversation([]);
    setQueryResponse(null);
    setQuestion("");
  }

  const selectedQuestions = getQuestionsByCategory(
    selectedQuestionCategory
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [conversation, queryLoading]);

  useEffect(() => {
    loadAdvisor();
  }, []);

  if (loading) {
    return (
      <div className="ai-advisor-page">
        <div className="ai-loading-shell">
          <div className="ai-loading-core">
            <div className="ai-loading-orbit ai-loading-orbit-one" />
            <div className="ai-loading-orbit ai-loading-orbit-two" />
            <div className="ai-loading-orbit ai-loading-orbit-three" />
            <div className="ai-loading-center">
              <Sparkles size={25} strokeWidth={1.5} />
            </div>
          </div>
          <div className="ai-loading-title">Preparing BusinessOS AI</div>
          <div className="ai-loading-text">
            Analyzing your business data securely...
          </div>
          <div className="ai-loading-progress">
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-advisor-page">
        <div className="ai-error-shell">
          <div className="ai-error-icon">
            <RefreshCw size={23} />
          </div>
          <span className="ai-card-kicker">INTELLIGENCE OFFLINE</span>
          <h2>AI Advisor unavailable</h2>
          <p>{error}</p>
          <button type="button" className="ai-primary-button" onClick={loadAdvisor}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const healthMessage =
    response?.sections?.find((section) => section.type === "health")
      ?.message || "Business health information is currently unavailable.";

  const financialMessage =
    response?.sections?.find((section) => section.type === "financial")
      ?.message || "Financial analysis is currently unavailable.";

  const paymentMessage =
    response?.sections?.find((section) => section.type === "payments")
      ?.message || "Customer payment analysis is currently unavailable.";

  const inventoryMessage =
    response?.sections?.find((section) => section.type === "inventory")
      ?.message || "Inventory analysis is currently unavailable.";

  const supplierMessage =
    response?.sections?.find((section) => section.type === "suppliers")
      ?.message || "Supplier analysis is currently unavailable.";

  const revenueValue = Number(response?.summary?.revenue || 0);
  const profitValue = Number(response?.summary?.netProfit || 0);
  const expenseValue = Number(response?.summary?.expenses || 0);
  const receivableValue = Number(
    response?.summary?.receivables?.totalReceivable || 0
  );

  const revenue = revenueValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  const profit = profitValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  const expenses = expenseValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
  const receivable = receivableValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

  let healthScore = 0;
  let healthScoreLabel = "Limited data";

  if (revenueValue > 0) {
    const profitMargin = (profitValue / revenueValue) * 100;
    const expenseRatio = (expenseValue / revenueValue) * 100;
    const receivableRatio = (receivableValue / revenueValue) * 100;

    let score = 50;
    score += clamp(profitMargin * 1.5, -35, 30);
    score -= clamp(Math.max(expenseRatio - 20, 0) * 0.5, 0, 15);
    score -= clamp(Math.max(receivableRatio - 25, 0) * 0.4, 0, 20);

    healthScore = Math.round(clamp(score, 0, 100));

    if (healthScore >= 75) healthScoreLabel = "Strong";
    else if (healthScore >= 50) healthScoreLabel = "Stable";
    else if (healthScore >= 30) healthScoreLabel = "Watch";
    else healthScoreLabel = "Needs attention";
  }

  const healthRingRadius = 57;
  const healthRingCircumference = 2 * Math.PI * healthRingRadius;
  const healthRingOffset =
    healthRingCircumference * (1 - healthScore / 100);

  const recommendationMessages = response?.recommendations || [];

  return (
    <div className="ai-advisor-page">
      <div className="ai-ambient-grid" />
      <div className="ai-ambient-glow ai-ambient-glow-one" />
      <div className="ai-ambient-glow ai-ambient-glow-two" />

      <div className="ai-advisor-container">
        <header className="ai-command-header">
          <div className="ai-command-header-main">
            <div className="ai-brand-icon">
              <Sparkles size={21} strokeWidth={1.7} />
              <span />
            </div>

            <div className="ai-header-copy">
              <div className="ai-title-row">
                <span className="ai-overline">BUSINESS INTELLIGENCE SYSTEM</span>
                <span className="ai-online-status">
                  <span className="ai-ready-dot" />
                  INTELLIGENCE ONLINE
                </span>
              </div>
              <h1>BusinessOS AI Command Center</h1>
              <p>
                Executive intelligence for your authorized business workspace.
              </p>
            </div>
          </div>

          <div className="ai-header-controls">
            <div className="ai-header-meta">
              <span><LockKeyhole size={12} /> READ-ONLY AI</span>
              <span><ShieldCheck size={12} /> AUTHORIZED WORKSPACE</span>
              <span><Activity size={12} /> REAL-TIME ANALYSIS</span>
            </div>

            <button
              type="button"
              className="ai-refresh-button"
              onClick={loadAdvisor}
              disabled={loading}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </header>

        <section className="ai-hero-grid">
          <section className="ai-panel ai-command-panel">
            <div className="ai-panel-topline">
              <div>
                <div className="ai-section-eyebrow">
                  <Radio size={13} />
                  AI CONVERSATION / COMMAND CONSOLE
                </div>
                <h2>Business intelligence briefing</h2>
              </div>
              <span className="ai-panel-status">
                <span /> LIVE
              </span>
            </div>

            <div className="ai-command-layout">
              <div className="ai-conversation-area">
                {conversation.length === 0 && (
                  <div className="ai-welcome-state">
                    <div className="ai-command-orb">
                      <div className="ai-orb-ring ring-one" />
                      <div className="ai-orb-ring ring-two" />
                      <div className="ai-orb-ring ring-three" />
                      <div className="ai-orb-core">
                        <Sparkles size={24} />
                      </div>
                    </div>

                    <span className="ai-welcome-kicker">
                      BUSINESSOS INTELLIGENCE
                    </span>
                    <h3>Ask your business a question.</h3>
                    <p>
                      BusinessOS reads authorized business signals and turns
                      them into clear executive-level reasoning and actions.
                    </p>

                    <div className="ai-welcome-points">
                      <span><Database size={12} /> Authorized data</span>
                      <span><ShieldCheck size={12} /> Read-only</span>
                      <span><Zap size={12} /> Action-focused</span>
                    </div>
                  </div>
                )}

                {conversation.length > 0 && (
                  <div className="ai-conversation-list">
                    {conversation.map((message) => {
                      const isUser = message.role === "user";

                      return (
                        <div
                          key={message.id}
                          className={`ai-message-row ${
                            isUser
                              ? "ai-message-row-user"
                              : "ai-message-row-assistant"
                          }`}
                        >
                          {!isUser && (
                            <div className="ai-message-avatar">
                              <Sparkles size={14} />
                            </div>
                          )}

                          <div
                            className={`ai-message ${
                              isUser
                                ? "ai-user-message"
                                : "ai-assistant-message"
                            } ${message.error ? "ai-message-error" : ""}`}
                          >
                            <div className="ai-message-label">
                              {isUser ? "COMMAND" : "BUSINESSOS AI"}
                            </div>
                            <div className="ai-message-content">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {queryLoading && (
                  <div className="ai-message-row ai-message-row-assistant">
                    <div className="ai-message-avatar">
                      <Sparkles size={14} />
                    </div>
                    <div className="ai-message ai-assistant-message">
                      <div className="ai-message-label">BUSINESSOS AI</div>
                      <div className="ai-analyzing-state">
                        <span>Analyzing authorized business intelligence</span>
                        <span className="ai-analyzing-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="ai-briefing-side">
                <div className="ai-briefing-line">
                  <span className="briefing-index">01</span>
                  <div>
                    <span>HEALTH SIGNAL</span>
                    <strong>{healthScoreLabel}</strong>
                  </div>
                </div>
                <div className="ai-briefing-line">
                  <span className="briefing-index">02</span>
                  <div>
                    <span>WHY</span>
                    <strong>Business signals are being evaluated together.</strong>
                  </div>
                </div>
                <div className="ai-briefing-line">
                  <span className="briefing-index">03</span>
                  <div>
                    <span>WHAT</span>
                    <strong>{healthMessage}</strong>
                  </div>
                </div>
                <div className="ai-briefing-line">
                  <span className="briefing-index">04</span>
                  <div>
                    <span>NEXT STEP</span>
                    <strong>Review the highest-priority signal before acting.</strong>
                  </div>
                </div>
              </div>
            </div>

            <form className="ai-composer" onSubmit={handleAskQuestion}>
              <div className="ai-composer-label">
                <span>ASK BUSINESSOS ANYTHING</span>
                <span>COMMAND MODE</span>
              </div>

              <div className="ai-composer-inner">
                <Search size={17} className="ai-composer-icon" />
                <input
                  type="text"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask BusinessOS anything about your business..."
                  autoComplete="off"
                  disabled={queryLoading}
                  aria-label="Ask BusinessOS anything"
                />
                <button
                  type="submit"
                  className="ai-send-button"
                  disabled={queryLoading || !question.trim()}
                  aria-label="Send question"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </form>

        <div className="ai-question-explorer ai-question-explorer-integrated">
          <div className="ai-section-heading compact">
            <div>
              <div className="ai-section-eyebrow">
                <Lightbulb size={13} />
                QUICK QUESTIONS
              </div>
              <h2>Select a question and get the answer here.</h2>
            </div>
            {conversation.length > 0 && (
              <button
                type="button"
                className="ai-clear-button"
                onClick={clearConversation}
              >
                <Trash2 size={14} />
                Clear session
              </button>
            )}
          </div>

          <div className="ai-category-scroll">
            {AI_QUESTION_CATEGORIES.map((category) => {
              const categoryKey = getCategoryKey(category);
              const categoryLabel = getCategoryLabel(category);
              const isActive = selectedQuestionCategory === categoryKey;

              return (
                <button
                  key={categoryKey}
                  type="button"
                  className={`ai-category-button ${
                    isActive ? "ai-category-button-active" : ""
                  }`}
                  onClick={() => setSelectedQuestionCategory(categoryKey)}
                >
                  {categoryLabel}
                </button>
              );
            })}
          </div>

          <div className="ai-question-grid">
            {selectedQuestions?.slice(0, 6).map((item) => {
              const questionText =
                item?.question || item?.text || item?.label || "";
              const itemCategory = item?.category || selectedQuestionCategory;
              const Icon = getQuestionIcon(itemCategory);

              return (
                <button
                  type="button"
                  key={item?.id || questionText}
                  className="ai-question-card"
                  onClick={() => askQuickQuestion(questionText)}
                >
                  <span className="ai-question-icon"><Icon size={16} /></span>
                  <span className="ai-question-copy">
                    <span className="ai-question-text">{questionText}</span>
                    <span className="ai-question-action">
                      ANALYZE <ArrowUpRight size={13} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

          </section>

          <aside className="ai-health-panel">
            <div className="ai-panel-topline">
              <div>
                <div className="ai-section-eyebrow">
                  <Gauge size={13} />
                  AI BUSINESS HEALTH
                </div>
                <h2>Current signal</h2>
              </div>
              <span className="ai-mini-live">LIVE</span>
            </div>

            <div className="ai-health-visual">
              <div className="ai-health-ring">
                <svg viewBox="0 0 140 140">
                  <circle
                    className="ai-health-ring-track"
                    cx="70"
                    cy="70"
                    r={healthRingRadius}
                  />
                  <circle
                    className="ai-health-ring-progress"
                    cx="70"
                    cy="70"
                    r={healthRingRadius}
                    strokeDasharray={healthRingCircumference}
                    strokeDashoffset={healthRingOffset}
                  />
                </svg>

                <div className="ai-health-ring-center">
                  <span>HEALTH SIGNAL</span>
                  <strong>{healthScoreLabel.toUpperCase()}</strong>
                  <small>{healthScore}% signal</small>
                </div>
              </div>

              <div className="ai-health-factors">
                {[
                  ["Revenue", revenue],
                  ["Profitability", profit],
                  ["Expenses", expenses],
                  ["Customer due", receivable],
                ].map(([label, value]) => (
                  <div className="ai-factor" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <i><span /></i>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-health-note">
              <Activity size={14} />
              <span>{healthMessage}</span>
            </div>
          </aside>
        </section>

        <section className="ai-core-section">
          <div className="ai-section-heading">
            <div>
              <div className="ai-section-eyebrow">
                <Database size={13} />
                BUSINESSOS INTELLIGENCE CORE
              </div>
              <h2>The business, continuously read as one system.</h2>
              <p>
                A conceptual architecture of the intelligence signals BusinessOS
                can connect and interpret.
              </p>
            </div>
            <div className="ai-core-status">
              <span className="ai-pulse-dot" />
              SIGNAL NETWORK ACTIVE
            </div>
          </div>

          <div className="ai-core-visual">
            <div className="ai-core-grid" />
            <div className="ai-core-orbit orbit-a" />
            <div className="ai-core-orbit orbit-b" />
            <div className="ai-core-orbit orbit-c" />
            <div className="ai-core-line line-a" />
            <div className="ai-core-line line-b" />
            <div className="ai-core-line line-c" />
            <div className="ai-core-line line-d" />

            <div className="ai-core-center">
              <div className="ai-core-center-ring">
                <Sparkles size={24} />
              </div>
              <strong>BusinessOS</strong>
              <span>AI</span>
              <small>INTELLIGENCE CORE</small>
            </div>

            {CORE_NODES.map(({ label, icon: Icon, position }, index) => (
              <div className={`ai-core-node ${position}`} key={label}>
                <div className="ai-core-node-icon">
                  <Icon size={15} />
                </div>
                <span>{label}</span>
                <i style={{ "--node-delay": `${index * 0.16}s` }} />
              </div>
            ))}

            <div className="ai-signal-particle particle-a" />
            <div className="ai-signal-particle particle-b" />
            <div className="ai-signal-particle particle-c" />
            <div className="ai-signal-particle particle-d" />
          </div>

          <div className="ai-processing-state">
            <div className="ai-processing-orb">
              <div />
            </div>
            <div>
              <span>AI PROCESSING STATE</span>
              <strong>ANALYZING BUSINESS DATA</strong>
              <p>Checking authorized business intelligence...</p>
            </div>
            <div className="ai-processing-bars">
              {Array.from({ length: 12 }).map((_, index) => (
                <i key={index} style={{ "--bar-delay": `${index * 0.08}s` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="ai-signals-section">
          <div className="ai-section-heading compact">
            <div>
              <div className="ai-section-eyebrow">
                <Radio size={13} />
                LIVE BUSINESS SIGNALS
              </div>
              <h2>BusinessOS is continuously reading the business.</h2>
            </div>
            <span className="ai-live-chip"><span /> LIVE</span>
          </div>

          <div className="ai-signals-grid">
            {SIGNALS.map(({ label, status, icon: Icon, tone, insight }, index) => (
              <article className={`ai-signal-card signal-${tone}`} key={label}>
                <div className="ai-signal-top">
                  <div className="ai-signal-icon"><Icon size={16} /></div>
                  <span>0{index + 1}</span>
                </div>
                <div className="ai-signal-label">{label}</div>
                <div className="ai-signal-status">{status}</div>
                <div className="ai-micro-chart">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
                <p>{insight}</p>
                <div className="ai-signal-footer">
                  <span><span className="signal-dot" /> MONITORED</span>
                  <ArrowUpRight size={13} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-modules-section">
          <div className="ai-section-heading compact">
            <div>
              <div className="ai-section-eyebrow">
                <Boxes size={13} />
                BUSINESS INTELLIGENCE MODULES
              </div>
              <h2>One intelligence layer across the business.</h2>
            </div>
          </div>

          <div className="ai-module-grid">
            {INTELLIGENCE_MODULES.map(({ label, icon: Icon, description }, index) => (
              <article className="ai-module-card" key={label}>
                <div className="ai-module-icon"><Icon size={17} /></div>
                <div className="ai-module-number">0{index + 1}</div>
                <span>{label}</span>
                <p>{description}</p>
                <div className="ai-module-line"><i /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-recommendations-section">
          <div className="ai-section-heading compact">
            <div>
              <div className="ai-section-eyebrow">
                <Lightbulb size={13} />
                AI RECOMMENDATION ENGINE
              </div>
              <h2>What BusinessOS AI recommends.</h2>
            </div>
            <span className="ai-recommendation-caption">EXECUTIVE ACTIONS</span>
          </div>

          <div className="ai-recommendation-grid">
            {recommendationMessages.length > 0 ? (
              recommendationMessages.map((recommendation, index) => (
                <article className="ai-recommendation-card" key={recommendation?.id || index}>
                  <div className="ai-recommendation-priority">
                    <span>{index === 0 ? "HIGH PRIORITY" : "REVIEW"}</span>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>
                    {typeof recommendation === "string"
                      ? recommendation
                      : recommendation?.message ||
                        recommendation?.text ||
                        recommendation?.title ||
                        "Review this area of your business."}
                  </h3>
                  <div className="ai-rec-detail">
                    <span>WHY</span>
                    <p>Based on the current authorized business intelligence.</p>
                  </div>
                  <div className="ai-rec-detail">
                    <span>NEXT STEP</span>
                    <p>Review the signal and prioritize the appropriate business action.</p>
                  </div>
                  <div className="ai-rec-detail">
                    <span>IMPACT</span>
                    <p>Designed to improve visibility, control and decision quality.</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="ai-empty-recommendations">
                No additional recommendations are available right now.
              </div>
            )}
          </div>
        </section>

        <footer className="ai-safety-footer">
          <div className="ai-safety-icon"><ShieldCheck size={16} /></div>
          <div>
            <strong>READ-ONLY AI · AUTHORIZED WORKSPACE</strong>
            <p>
              Your business data stays within your authorized BusinessOS
              workspace. BusinessOS AI can analyze authorized records and
              provide recommendations, but it does not directly modify them.
            </p>
          </div>
          <div className="ai-security-badges">
            <span><LockKeyhole size={12} /> READ-ONLY</span>
            <span><Building2 size={12} /> WORKSPACE SCOPED</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
