import { useEffect, useRef, useState } from "react";
import "../../styles/AIAssistantWidget.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bot,
  Check,
  CircleAlert,
  Edit3,
  LoaderCircle,
  Mic,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { askBusinessQuestion } from "../../services/ai/aiService";

import { parseAgentRequest } from "../../services/ai/agentParser";
import { resolveAgentEntities } from "../../services/ai/agentEntityMatcher";

function AIAssistantWidget() {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [speechError, setSpeechError] = useState("");
  const [agentMode, setAgentMode] = useState(null);
  const [responseLanguage, setResponseLanguage] = useState("auto");

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceBaseQuestionRef = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function clearChat() {
    setAgentMode(null);
    setQuestion("");
    setVoiceError("");
    setSpeechError("");
    setMessages([]);
    setLoading(false);

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsListening(false);
    setSpeakingMessageId(null);
  }

  function handleVoiceInput() {
    if (loading) {
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    setVoiceError("");

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    voiceBaseQuestionRef.current = question.trim();

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let index = 0;
        index < event.results.length;
        index += 1
      ) {
        transcript += event.results[index][0].transcript;
      }

      const cleanTranscript = transcript.trim();

      if (!cleanTranscript) {
        return;
      }

      const baseQuestion = voiceBaseQuestionRef.current;

      setQuestion(
        [baseQuestion, cleanTranscript]
          .filter(Boolean)
          .join(" ")
      );
    };

    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed") {
        setVoiceError(
          "Microphone permission was denied. Please allow microphone access and try again."
        );
        return;
      }

      if (event.error === "no-speech") {
        setVoiceError(
          "No speech was detected. Please try again."
        );
        return;
      }

      if (event.error === "audio-capture") {
        setVoiceError(
          "No microphone was available. Please check your microphone."
        );
        return;
      }

      if (event.error !== "aborted") {
        setVoiceError(
          "Voice input could not be started. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function handleSpeakMessage(message, messageId) {
    if (!message || typeof window === "undefined") {
      return;
    }

    if (!("speechSynthesis" in window)) {
      setSpeechError(
        "Voice output is not supported in this browser."
      );
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setSpeechError("");
      return;
    }

    window.speechSynthesis.cancel();
    setSpeechError("");

    const utterance = new SpeechSynthesisUtterance(
      String(message)
    );

    utterance.lang = navigator.language || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      setSpeechError("");
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = (event) => {
      setSpeakingMessageId(null);

      if (
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        setSpeechError(
          "Voice output could not be played. Please try again."
        );
      }
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  }

  async function submitBusinessQuestion(rawQuestion, questionId = undefined) {
    const trimmedQuestion = String(rawQuestion || "").trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    if (agentMode) {
      const agentResult = parseAgentRequest(trimmedQuestion);

      if (!agentResult?.success) {
        setQuestion("");

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `${Date.now()}-agent-request`,
            role: "user",
            message: trimmedQuestion,
            data: {
              type: "agent-request",
            },
          },
          {
            id: `${Date.now()}-agent-error`,
            role: "assistant",
            message:
              "I could not understand that operation. Please describe what you want to sell, purchase, find, or check.",
            success: false,
            data: {
              type: "agent-error",
            },
          },
        ]);

        return;
      }

      setQuestion("");
      setLoading(true);

      try {
        const resolvedResult =
          await resolveAgentEntities(agentResult);

        if (!resolvedResult?.success) {
          const hasAmbiguity =
            resolvedResult.status === "ambiguous";

          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: `${Date.now()}-agent-request`,
              role: "user",
              message: trimmedQuestion,
              data: {
                type: "agent-request",
              },
            },
            {
              id: `${Date.now()}-agent-resolution`,
              role: "assistant",
              message: hasAmbiguity
                ? "I found multiple possible matches. Please choose the correct one before I prepare the final draft."
                : "I understood the operation, but some business information could not be resolved safely.",
              success: false,
              data: {
                type: "agent-resolution",
                agentResult: resolvedResult,
              },
            },
          ]);

          return;
        }

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `${Date.now()}-agent-request`,
            role: "user",
            message: trimmedQuestion,
            data: {
              type: "agent-request",
            },
          },
          {
            id: `${Date.now()}-agent-draft`,
            role: "assistant",
            message:
              resolvedResult.parsedRequest.intent === "sale"
                ? "I matched your products and prepared a sale draft for review."
                : resolvedResult.parsedRequest.intent === "purchase"
                  ? "I matched your products and prepared a purchase draft for review."
                  : "I matched the requested business information and prepared a draft for review.",
            success: true,
            data: {
              type: "agent-draft",
              agentResult: resolvedResult,
            },
          },
        ]);
      } catch (error) {
        console.error(
          "Agent Entity Resolution Error:",
          error
        );

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: `${Date.now()}-agent-request`,
            role: "user",
            message: trimmedQuestion,
            data: {
              type: "agent-request",
            },
          },
          {
            id: `${Date.now()}-agent-error`,
            role: "assistant",
            message:
              "I could not safely resolve the business information right now. No business data was changed.",
            success: false,
            data: {
              type: "agent-error",
            },
          },
        ]);
      } finally {
        setLoading(false);
      }

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
      const response =
        await askBusinessQuestion(
          trimmedQuestion,
          questionId,
          responseLanguage
        );

      if (
        !response?.success ||
        !response?.data?.answer
      ) {
        throw new Error(
          "BusinessOS AI could not prepare an answer."
        );
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

  const commonBusinessQuestions = [
    {
      label: "Sales revenue",
      question: "Meri total sales revenue kitni hai?",
      questionId: "sales_002",
      icon: BarChart3,
    },
    {
      label: "Profit",
      question: "Mera current profit kitna hai?",
      questionId: "profit_001",
      icon: BarChart3,
    },
    {
      label: "Low stock",
      question: "Kaun se products low stock mein hain?",
      questionId: "inventory_002",
      icon: Package,
    },
    {
      label: "Customer payments",
      question: "Kin customers ke payments outstanding hain?",
      questionId: "payments_002",
      icon: UserRound,
    },
    {
      label: "Top products",
      question: "Mere sabse zyada bikne wale products kaun se hain?",
      questionId: "sales_004",
      icon: ShoppingCart,
    },
  ];

  function handleQuickQuestion(value, questionId = undefined) {
    if (loading || !value) {
      return;
    }

    setVoiceError("");
    setSpeechError("");

    submitBusinessQuestion(value, questionId);
  }

  function handleAgentAction(action) {
    setAgentMode(action);
    setQuestion("");
    setVoiceError("");
    setSpeechError("");
  }

  function handleNewAgentRequest() {
    clearChat();
  }

  function handleAgentConfirm(agentResult) {
    if (!agentResult?.parsedRequest?.draft) {
      return;
    }

    const draft = agentResult.parsedRequest.draft;
    const intent = agentResult.parsedRequest.intent;

    const confirmData = {
      intent,
      items: draft.items || [],
      customerName: draft.customerName || null,
      supplierName: draft.supplierName || null,
      paymentStatus: draft.paymentStatus || null,
      paymentMethod: draft.paymentMethod || null,

      // Preserve the securely resolved business entity IDs.
      resolvedEntities: {
        customer: agentResult?.entities?.customer || null,
        supplier: agentResult?.entities?.supplier || null,
        items: Array.isArray(agentResult?.entities?.items)
          ? agentResult.entities.items
          : [],
      },

      // eslint-disable-next-line react-hooks/purity
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem("ai_agent_draft", JSON.stringify(confirmData));
    } catch (error) {
      console.error("Failed to store agent draft:", error);
    }

    if (intent === "sale") {
      clearChat();
      setIsOpen(false);
      navigate("/sales");
    } else if (intent === "purchase") {
      clearChat();
      setIsOpen(false);
      navigate("/purchases");
    } else {
      clearChat();
    }
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
            border border-[#b08a4b]/40
            bg-[#080807]
            text-white
            shadow-[0_12px_40px_rgba(0,0,0,0.45)]
            transition-all duration-300
            hover:-translate-y-1
            hover:scale-105
            hover:border-[#c7a66a]/70
            hover:shadow-[0_16px_45px_rgba(199,166,106,0.18)]
            active:scale-95
            sm:bottom-6 sm:right-6
          "
        >
          <span
            className="
              absolute inset-0 rounded-2xl
              bg-[#c7a66a]/10
              animate-pulse
            "
          />

          <span
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-[#c7a66a] to-[#8f6b36]
              text-[#17130d]
              shadow-[0_6px_18px_rgba(199,166,106,0.16)]
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
            min-h-0
            h-[min(640px,calc(100vh-32px))]
            w-[min(400px,calc(100vw-32px))]
            flex-col
            overflow-hidden
            rounded-3xl
            border border-[#c7a66a]/15
            bg-[#080807]
            shadow-[0_24px_80px_rgba(0,0,0,0.55)]
            animate-[aiWidgetIn_220ms_ease-out]
            sm:bottom-6 sm:right-6
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              border-b border-[#c7a66a]/15
              bg-[#050505]
              px-4 py-3
              text-white
            "
          >
            <div
              className="
                pointer-events-none absolute
                -right-12 -top-16
                h-40 w-40
                rounded-full
                bg-[#c7a66a]/10
                blur-3xl
              "
            />

            <div className="relative flex flex-col gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-2xl
                    bg-gradient-to-br from-[#c7a66a] to-[#8f6b36]
                    text-[#17130d]
                    shadow-lg shadow-[#b08a4b]/15
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
                    <p className="text-xs text-[#918c82]">
                      Your business assistant
                    </p>

                    <span className="text-[#4b4842]">•</span>

                    <span className="truncate text-[10px] font-medium text-[#c7a66a]">
                      {pageContext.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-end gap-1.5">
                <div className="relative">
                  <label htmlFor="ai-response-language" className="sr-only">
                    AI response language
                  </label>

                  <select
                    id="ai-response-language"
                    value={responseLanguage}
                    onChange={(event) => setResponseLanguage(event.target.value)}
                    disabled={loading}
                    title="AI response language"
                    className="
      h-9 max-w-[132px]
      cursor-pointer
      rounded-xl
      border border-white/10
      bg-[#0c0c0b]
      px-2.5
      text-[10px] font-medium
      text-[#c7a66a]
      outline-none
      transition-all duration-200
      hover:border-[#b08a4b]/30
      focus:border-[#c7a66a]/40
      disabled:cursor-not-allowed
      disabled:opacity-50
      sm:max-w-[150px]
    "
                  >
                    <option value="auto">Auto Detect</option>
                    <option value="english">English</option>
                    <option value="urdu">اردو</option>
                    <option value="roman_urdu">Roman Urdu</option>
                    <option value="hindi">हिन्दी</option>
                    <option value="roman_hindi">Roman Hindi</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    aria-label="Clear AI chat"
                    title="Clear chat"
                    className="
                      flex h-9 items-center gap-1.5
                      rounded-xl
                      border border-white/10
                      bg-[#0c0c0b]
                      px-2.5
                      text-[10px] font-medium
                      text-[#918c82]
                      transition-all duration-200
                      hover:border-rose-400/20
                      hover:bg-rose-950/10
                      hover:text-rose-300
                      active:scale-95
                    "
                  >
                    <X size={14} />
                    <span>Clear Chat</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close BusinessOS AI Assistant"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-transparent
                    text-[#918c82]
                    transition-all duration-200
                    hover:border-[#b08a4b]/15
                    hover:bg-[#17130d]
                    hover:text-[#dfc58f]
                    active:scale-95
                  "
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[#0a0a09] px-4 py-5 sm:px-5">
            {messages.length === 0 ? (
              <>
                <div className="flex gap-3">
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-xl
                      border border-[#b08a4b]/20
                      bg-[#b08a4b]/10
                      text-[#c7a66a]
                    "
                  >
                    <Sparkles size={17} />
                  </div>

                  <div
                    className="
                      max-w-[85%]
                      rounded-2xl rounded-tl-md
                      border border-white/10
                      bg-[#11110f]
                      px-4 py-3
                      shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                    "
                  >
                    <p className="text-sm leading-6 text-[#e8e4dc]">
                      Hi! 👋 I&apos;m your BusinessOS AI assistant.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#918c82]">
                      Ask me about your sales, profit, expenses,
                      stock, customers or payments.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-[#77736b]">
                    Try asking
                  </p>

                  <div className="space-y-5">
                    {/* Agent Introduction */}
                    <div
                      className="
                        rounded-2xl
                        border border-[#b08a4b]/20
                        bg-gradient-to-br
                        from-[#15130f]
                        via-[#0d0d0c]
                        to-[#080808]
                        p-5
                        shadow-[0_18px_50px_rgba(0,0,0,0.28)]
                      "
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="
                            flex h-11 w-11 shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-[#b08a4b]/30
                            bg-[#b08a4b]/10
                          "
                        >
                          <Bot
                            size={21}
                            className="text-[#c7a66a]"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold tracking-wide text-white">
                              BusinessOS AI Agent
                            </p>

                            <span
                              className="
                                rounded-full
                                border border-[#b08a4b]/25
                                bg-[#b08a4b]/10
                                px-2 py-0.5
                                text-[9px] font-semibold
                                uppercase tracking-[0.16em]
                                text-[#c7a66a]
                              "
                            >
                              Read-only
                            </span>
                          </div>

                          <p className="mt-1 text-xs leading-5 text-[#918c82]">
                            Ask questions, find business information,
                            or prepare an operation using natural language.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Agent Actions */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
                            What can I help you accomplish?
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleAgentAction("sale")}
                          className="
                            group flex w-full items-center gap-3
                            rounded-xl
                            border border-white/10
                            bg-[#10100f]
                            px-4 py-3.5
                            text-left
                            transition-all duration-200
                            hover:border-[#b08a4b]/40
                            hover:bg-[#15130f]
                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                          "
                        >
                          <div
                            className="
                              flex h-9 w-9 shrink-0
                              items-center justify-center
                              rounded-lg
                              border border-[#b08a4b]/20
                              bg-[#b08a4b]/10
                            "
                          >
                            <ShoppingCart
                              size={17}
                              className="text-[#c7a66a]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">
                              Create Sale
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#77736b]">
                              Describe what was sold using text or voice
                            </p>
                          </div>

                          <ArrowRight
                            size={15}
                            className="
                              text-[#4b4842]
                              transition-transform
                              group-hover:translate-x-0.5
                              group-hover:text-[#c7a66a]
                            "
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAgentAction("purchase")}
                          className="
                            group flex w-full items-center gap-3
                            rounded-xl
                            border border-white/10
                            bg-[#10100f]
                            px-4 py-3.5
                            text-left
                            transition-all duration-200
                            hover:border-[#b08a4b]/40
                            hover:bg-[#15130f]
                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                          "
                        >
                          <div
                            className="
                              flex h-9 w-9 shrink-0
                              items-center justify-center
                              rounded-lg
                              border border-[#b08a4b]/20
                              bg-[#b08a4b]/10
                            "
                          >
                            <Package
                              size={17}
                              className="text-[#c7a66a]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">
                              Create Purchase
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#77736b]">
                              Tell me what you received from a supplier
                            </p>
                          </div>

                          <ArrowRight
                            size={15}
                            className="
                              text-[#4b4842]
                              transition-transform
                              group-hover:translate-x-0.5
                              group-hover:text-[#c7a66a]
                            "
                          />
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleAgentAction("product")}
                            className="
                              group rounded-xl
                              border border-white/10
                              bg-[#10100f]
                              p-3.5
                              text-left
                              transition-all duration-200
                              hover:border-[#b08a4b]/40
                              hover:bg-[#15130f]
                              hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                            "
                          >
                            <Search
                              size={17}
                              className="text-[#c7a66a]"
                            />

                            <p className="mt-2 text-xs font-medium text-white">
                              Find Product
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-[#77736b]">
                              Search your product information
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAgentAction("customer")}
                            className="
                              group rounded-xl
                              border border-white/10
                              bg-[#10100f]
                              p-3.5
                              text-left
                              transition-all duration-200
                              hover:border-[#b08a4b]/40
                              hover:bg-[#15130f]
                              hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                            "
                          >
                            <UserRound
                              size={17}
                              className="text-[#c7a66a]"
                            />

                            <p className="mt-2 text-xs font-medium text-white">
                              Customer
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-[#77736b]">
                              Check customer information
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Common Business Questions */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Sparkles
                          size={13}
                          className="text-[#c7a66a]"
                        />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
                          Common business questions
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        {commonBusinessQuestions.map(
                          ({
                            label,
                            question: itemQuestion,
                            questionId: itemQuestionId,
                            icon: Icon,
                          }) => (
                            <button
                              key={itemQuestion}
                              type="button"
                              onClick={() =>
                                handleQuickQuestion(itemQuestion, itemQuestionId)
                              }
                              disabled={loading}
                              className="
                                group flex w-full items-center gap-3
                                rounded-lg
                                border border-transparent
                                px-3 py-2.5
                                text-left
                                transition-all duration-200
                                hover:border-[#b08a4b]/15
                                hover:bg-[#15130f]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              <Icon
                                size={14}
                                className="
                                  shrink-0
                                  text-[#4b4842]
                                  transition-colors
                                  group-hover:text-[#c7a66a]
                                "
                              />

                              <span
                                className="
                                  min-w-0 flex-1 truncate
                                  text-xs
                                  text-[#918c82]
                                  transition-colors
                                  group-hover:text-[#e8e4dc]
                                "
                              >
                                {itemQuestion}
                              </span>

                              <span
                                className="
                                  hidden
                                  text-[9px]
                                  uppercase
                                  tracking-wider
                                  text-[#4b4842]
                                  sm:block
                                "
                              >
                                {label}
                              </span>

                              <ArrowUp
                                size={12}
                                className="
                                  shrink-0
                                  text-[#4b4842]
                                  transition-colors
                                  group-hover:text-[#c7a66a]
                                "
                              />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-5 pb-2">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 ${item.role === "user"
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
                          border border-[#b08a4b]/20
                          bg-[#b08a4b]/10
                          text-[#c7a66a]
                        "
                      >
                        <Sparkles size={15} />
                      </div>
                    )}

                    <div
                      className={`
                        w-fit max-w-[88%] sm:max-w-[82%]
                        rounded-2xl
                        px-4 py-3
                        text-sm leading-6
                        ${item.role === "user"
                          ? `
                              rounded-br-md
                              border border-[#b08a4b]/20
                              bg-[#17130d]
                              text-[#f5f2eb]
                            `
                          : item.success === false
                            ? `
                                rounded-tl-md
                                border border-rose-400/20
                                bg-rose-950/20
                                text-rose-200
                              `
                            : `
                                rounded-tl-md
                                border border-white/10
                                bg-[#11110f]
                                text-[#e8e4dc]
                                shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                              `
                        }
                      `}
                    >
                      {item.data?.type === "agent-draft" ? (
                        <div className="space-y-4">
                          {(() => {
                            const agentResult =
                              item.data.agentResult;

                            const parsedRequest =
                              agentResult?.parsedRequest || {};

                            const draft =
                              parsedRequest?.draft || {};

                            const items = Array.isArray(
                              draft.items
                            )
                              ? draft.items
                              : [];

                            const resolvedItems =
                              Array.isArray(
                                agentResult?.entities?.items
                              )
                                ? agentResult.entities.items
                                : [];

                            const isSale =
                              parsedRequest?.intent === "sale";

                            const isPurchase =
                              parsedRequest?.intent === "purchase";

                            const productSearch =
                              agentResult?.entities?.productSearch ||
                              null;

                            const isProductSearch =
                              parsedRequest?.intent === "product";

                            return (
                              <>
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c7a66a]">
                                      {isSale
                                        ? "Sale Draft"
                                        : isPurchase
                                          ? "Purchase Draft"
                                          : isProductSearch
                                            ? "Product Found"
                                            : "Agent Draft"}
                                    </div>

                                    <div className="mt-1 text-sm font-medium text-[#f5f2eb]">
                                      Ready for review
                                    </div>
                                  </div>

                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#b08a4b]/20 bg-[#b08a4b]/10 text-[#c7a66a]">
                                    <Check size={15} />
                                  </div>
                                </div>

                                {isProductSearch ? (
                                  <div className="rounded-xl border border-white/10 bg-[#0c0c0b] p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77736c]">
                                      Product Information
                                    </div>

                                    {productSearch?.status ===
                                      "matched" &&
                                      productSearch?.item ? (
                                      <div className="rounded-lg border border-[#b08a4b]/15 bg-[#11110f] p-3">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0">
                                            <div className="font-medium text-[#f5f2eb]">
                                              {
                                                productSearch.item
                                                  .product_name
                                              }
                                            </div>

                                            <div className="mt-2 space-y-1 text-xs text-[#918c82]">
                                              <div>
                                                Stock:{" "}
                                                <span className="text-[#e8e4dc]">
                                                  {productSearch
                                                    .item
                                                    .stock ?? "—"}
                                                </span>
                                              </div>

                                              <div>
                                                Selling price:{" "}
                                                <span className="text-[#c7a66a]">
                                                  Rs{" "}
                                                  {productSearch
                                                    .item
                                                    .price ?? "—"}
                                                </span>
                                              </div>

                                              <div>
                                                Cost price:{" "}
                                                <span className="text-[#e8e4dc]">
                                                  Rs{" "}
                                                  {productSearch
                                                    .item
                                                    .cost_price ??
                                                    "—"}
                                                </span>
                                              </div>

                                              <div>
                                                Unit:{" "}
                                                <span className="text-[#e8e4dc]">
                                                  {productSearch
                                                    .item
                                                    .selling_unit ||
                                                    "pcs"}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="shrink-0 rounded-lg border border-emerald-400/15 bg-emerald-950/20 px-2 py-1 text-[10px] font-medium text-emerald-300">
                                            Matched
                                          </div>
                                        </div>
                                      </div>
                                    ) : productSearch?.status ===
                                      "ambiguous" ? (
                                      <div className="space-y-2">
                                        <div className="text-xs leading-5 text-[#b7b0a5]">
                                          Multiple products matched. Please choose the correct
                                          product before continuing.
                                        </div>

                                        {(
                                          productSearch.candidates ||
                                          []
                                        ).map((candidate) => (
                                          <div
                                            key={candidate.id}
                                            className="rounded-lg border border-white/5 bg-[#11110f] p-3"
                                          >
                                            <div className="font-medium text-[#f5f2eb]">
                                              {
                                                candidate.product_name
                                              }
                                            </div>

                                            <div className="mt-1 text-xs text-[#918c82]">
                                              Stock:{" "}
                                              {candidate.stock ??
                                                "—"}{" "}
                                              · Price: Rs{" "}
                                              {candidate.price ??
                                                "—"}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="flex gap-2 rounded-lg border border-amber-300/10 bg-amber-950/10 p-3">
                                        <CircleAlert
                                          size={15}
                                          className="mt-0.5 shrink-0 text-[#c7a66a]"
                                        />

                                        <div className="text-xs leading-5 text-[#b7b0a5]">
                                          No matching product was found in this business.
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-white/10 bg-[#0c0c0b] p-3">
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77736c]">
                                      Items
                                    </div>

                                    <div className="space-y-2">
                                      {items.length > 0 ? (
                                        items.map(
                                          (
                                            entry,
                                            index
                                          ) => {
                                            const resolvedItem =
                                              resolvedItems[
                                              index
                                              ];

                                            const matchedProduct =
                                              resolvedItem
                                                ?.product
                                                ?.item;

                                            const productName =
                                              matchedProduct?.product_name ||
                                              entry.productName ||
                                              resolvedItem
                                                ?.parsed
                                                ?.productText ||
                                              "Unnamed product";

                                            return (
                                              <div
                                                key={`${matchedProduct?.id || productName}-${index}`}
                                                className="rounded-lg border border-white/5 bg-[#11110f] p-3"
                                              >
                                                <div className="flex items-start justify-between gap-3">
                                                  <div className="min-w-0">
                                                    <div className="font-medium text-[#f5f2eb]">
                                                      {productName}
                                                    </div>

                                                    <div className="mt-1 text-xs text-[#918c82]">
                                                      Qty:{" "}
                                                      {entry.quantity ??
                                                        "—"}
                                                      {entry.unit
                                                        ? ` ${entry.unit}`
                                                        : ""}
                                                    </div>
                                                  </div>

                                                  <div className="shrink-0 text-right">
                                                    <div className="text-sm font-semibold text-[#c7a66a]">
                                                      {entry.unitPrice !=
                                                        null
                                                        ? `Rs ${entry.unitPrice}`
                                                        : "Price not provided"}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <div className="text-xs text-[#918c82]">
                                          No items were detected.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {(draft.customerName ||
                                  draft.supplierName) && (
                                    <div className="grid grid-cols-2 gap-2">
                                      {draft.customerName && (
                                        <div className="rounded-xl border border-white/10 bg-[#0c0c0b] p-3">
                                          <div className="text-[10px] uppercase tracking-[0.12em] text-[#77736c]">
                                            Customer
                                          </div>

                                          <div className="mt-1 text-sm font-medium text-[#e8e4dc]">
                                            {draft.customerName}
                                          </div>
                                        </div>
                                      )}

                                      {draft.supplierName && (
                                        <div className="rounded-xl border border-white/10 bg-[#0c0c0b] p-3">
                                          <div className="text-[10px] uppercase tracking-[0.12em] text-[#77736c]">
                                            Supplier
                                          </div>

                                          <div className="mt-1 text-sm font-medium text-[#e8e4dc]">
                                            {draft.supplierName}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                {(draft.paymentStatus ||
                                  draft.paymentMethod) && (
                                    <div className="flex flex-wrap gap-2">
                                      {draft.paymentStatus && (
                                        <span className="rounded-full border border-[#b08a4b]/20 bg-[#b08a4b]/10 px-2.5 py-1 text-[11px] font-medium text-[#c7a66a]">
                                          Payment:{" "}
                                          {draft.paymentStatus}
                                        </span>
                                      )}

                                      {draft.paymentMethod && (
                                        <span className="rounded-full border border-white/10 bg-[#11110f] px-2.5 py-1 text-[11px] font-medium text-[#918c82]">
                                          Method:{" "}
                                          {draft.paymentMethod}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                {!isProductSearch && (
                                  <>
                                    {draft.total != null ? (
                                      <div className="flex items-center justify-between rounded-xl border border-[#b08a4b]/20 bg-[#17130d] px-3 py-3">
                                        <span className="text-xs uppercase tracking-[0.12em] text-[#918c82]">
                                          Total
                                        </span>

                                        <span className="text-base font-semibold text-[#f5f2eb]">
                                          Rs {draft.total}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2 rounded-xl border border-amber-300/10 bg-amber-950/10 p-3">
                                        <CircleAlert
                                          size={15}
                                          className="mt-0.5 shrink-0 text-[#c7a66a]"
                                        />

                                        <div className="text-xs leading-5 text-[#b7b0a5]">
                                          Some information is missing. Review the draft before continuing.
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAgentConfirm(
                                            item.data.agentResult
                                          )
                                        }
                                        className="
                                          inline-flex items-center justify-center gap-1.5
                                          rounded-lg
                                          border border-[#b08a4b]/30
                                          bg-[#17130d]
                                          px-2.5 py-2
                                          text-[11px] font-semibold
                                          text-[#c7a66a]
                                          transition-all duration-200
                                          hover:border-[#b08a4b]/50
                                          hover:bg-[#211a10]
                                        "
                                      >
                                        <Check size={13} />
                                        Confirm
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setQuestion("");
                                        }}
                                        className="
                                          inline-flex items-center justify-center gap-1.5
                                          rounded-lg
                                          border border-white/10
                                          bg-[#0c0c0b]
                                          px-2.5 py-2
                                          text-[11px] font-medium
                                          text-[#918c82]
                                          transition-all duration-200
                                          hover:border-white/20
                                          hover:text-[#e8e4dc]
                                        "
                                      >
                                        <Edit3 size={13} />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={
                                          handleNewAgentRequest
                                        }
                                        className="
                                          inline-flex items-center justify-center gap-1.5
                                          rounded-lg
                                          border border-white/10
                                          bg-[#0c0c0b]
                                          px-2.5 py-2
                                          text-[11px] font-medium
                                          text-[#918c82]
                                          transition-all duration-200
                                          hover:border-rose-400/20
                                          hover:bg-rose-950/10
                                          hover:text-rose-300
                                        "
                                      >
                                        <ArrowRight size={13} />
                                        New Request
                                      </button>
                                    </div>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div
                          className="whitespace-pre-wrap break-words"
                          style={{
                            animation: "none",
                            transition: "none",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {item.message}
                        </div>
                      )}

                      {item.role === "assistant" &&
                        item.success !== false && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSpeakMessage(
                                item.message,
                                item.id
                              )
                            }
                            disabled={loading}
                            aria-label={
                              speakingMessageId === item.id
                                ? "Stop voice output"
                                : "Read AI response aloud"
                            }
                            title={
                              speakingMessageId === item.id
                                ? "Stop speaking"
                                : "Read response aloud"
                            }
                            className="
                              mt-3
                              inline-flex items-center gap-2
                              rounded-lg
                              border border-white/10
                              bg-[#0c0c0b]
                              px-2.5 py-1.5
                              text-[11px] font-medium
                              text-[#918c82]
                              transition-all duration-200
                              hover:border-[#b08a4b]/35
                              hover:bg-[#17130d]
                              hover:text-[#c7a66a]
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            <Mic
                              size={13}
                              className={
                                speakingMessageId === item.id
                                  ? "animate-pulse"
                                  : ""
                              }
                            />

                            {speakingMessageId === item.id
                              ? "Stop"
                              : "Listen"}
                          </button>
                        )}
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
                        border border-[#b08a4b]/20
                        bg-[#b08a4b]/10
                        text-[#c7a66a]
                      "
                    >
                      <Sparkles size={15} />
                    </div>

                    <div
                      className="
                        flex items-center gap-2
                        rounded-2xl rounded-tl-md
                        border border-white/10
                        bg-[#11110f]
                        px-4 py-3
                        shadow-[0_8px_24px_rgba(0,0,0,0.20)]
                      "
                    >
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#c7a66a]" />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-[#c7a66a]"
                        style={{
                          animationDelay: "120ms",
                        }}
                      />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-[#c7a66a]"
                        style={{
                          animationDelay: "240ms",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Persistent Quick Questions */}
                {!agentMode && !loading && (
                  <div className="pt-2">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={13}
                          className="text-[#c7a66a]"
                        />

                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736b]">
                          More questions
                        </p>
                      </div>

                      <span className="text-[9px] text-[#4b4842]">
                        Choose anytime
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {commonBusinessQuestions.map(
                        ({
                          label,
                          question: itemQuestion,
                          questionId: itemQuestionId,
                          icon: Icon,
                        }) => (
                          <button
                            key={`persistent-${itemQuestion}`}
                            type="button"
                            onClick={() =>
                              handleQuickQuestion(itemQuestion, itemQuestionId)
                            }
                            className="
                              group flex w-full items-center gap-3
                              rounded-lg
                              border border-transparent
                              px-3 py-2.5
                              text-left
                              transition-all duration-200
                              hover:border-[#b08a4b]/15
                              hover:bg-[#15130f]
                            "
                          >
                            <Icon
                              size={14}
                              className="
                                shrink-0
                                text-[#4b4842]
                                transition-colors
                                group-hover:text-[#c7a66a]
                              "
                            />

                            <span
                              className="
                                min-w-0 flex-1 truncate
                                text-xs
                                text-[#918c82]
                                transition-colors
                                group-hover:text-[#e8e4dc]
                              "
                            >
                              {itemQuestion}
                            </span>

                            <span
                              className="
                                hidden
                                text-[9px]
                                uppercase
                                tracking-wider
                                text-[#4b4842]
                                sm:block
                              "
                            >
                              {label}
                            </span>

                            <ArrowUp
                              size={12}
                              className="
                                shrink-0
                                text-[#4b4842]
                                transition-colors
                                group-hover:text-[#c7a66a]
                              "
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* New Agent Request / Clear Chat */}
                {messages.length > 0 && !loading && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={clearChat}
                      className="
                        flex w-full items-center justify-center gap-2
                        rounded-xl
                        border border-white/10
                        bg-[#0c0c0b]
                        px-3 py-2.5
                        text-[11px] font-medium
                        text-[#918c82]
                        transition-all duration-200
                        hover:border-[#b08a4b]/30
                        hover:bg-[#15130f]
                        hover:text-[#c7a66a]
                      "
                    >
                      <X size={13} />
                      Start New Chat
                    </button>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {agentMode && (
            <div
              className="
                border-t border-[#b08a4b]/15
                bg-[#0d0d0c]
                px-4 py-2.5
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="
                      flex h-6 w-6 shrink-0
                      items-center justify-center
                      rounded-md
                      border border-[#b08a4b]/15
                      bg-[#b08a4b]/10
                    "
                  >
                    {agentMode === "sale" ? (
                      <ShoppingCart
                        size={12}
                        className="text-[#c7a66a]"
                      />
                    ) : agentMode === "purchase" ? (
                      <Package
                        size={12}
                        className="text-[#c7a66a]"
                      />
                    ) : agentMode === "product" ? (
                      <Search
                        size={12}
                        className="text-[#c7a66a]"
                      />
                    ) : (
                      <UserRound
                        size={12}
                        className="text-[#c7a66a]"
                      />
                    )}
                  </span>

                  <span className="truncate text-[11px] text-[#918c82]">
                    {agentMode === "sale"
                      ? "Sale assistant ready"
                      : agentMode === "purchase"
                        ? "Purchase assistant ready"
                        : agentMode === "product"
                          ? "Product search ready"
                          : "Customer assistant ready"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNewAgentRequest}
                  className="
                    shrink-0
                    text-[10px] font-medium
                    text-[#77736b]
                    transition-colors
                    hover:text-[#dfc58f]
                  "
                >
                  New Request
                </button>
              </div>
            </div>
          )}

          {speechError && (
            <p
              role="status"
              className="
                border-t border-white/10
                bg-[#0b0b0a]
                px-4 py-2
                text-center
                text-xs
                text-rose-300
              "
            >
              {speechError}
            </p>
          )}

          {/* Composer */}
          <div
            className="
              border-t border-white/10
              bg-[#080807]
              p-3
              sm:p-4
            "
          >
            <form onSubmit={handleSubmit}>
              {voiceError && (
                <p
                  role="status"
                  className="
                    mb-2
                    text-center
                    text-xs
                    text-rose-300
                  "
                >
                  {voiceError}
                </p>
              )}

              <div
                className="
                  flex items-center gap-2
                  rounded-2xl
                  border border-white/10
                  bg-[#11110f]
                  p-2
                  transition-all duration-200
                  focus-within:border-[#b08a4b]/45
                  focus-within:bg-[#15130f]
                  focus-within:ring-4
                  focus-within:ring-[#c7a66a]/10
                "
              >
                <input
                  type="text"
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  disabled={loading || isListening}
                  placeholder={
                    agentMode
                      ? "Describe what you want to do..."
                      : "Ask your business anything..."
                  }
                  className="
                    min-w-0 flex-1
                    bg-transparent
                    px-2
                    py-2
                    text-sm
                    text-[#f5f2eb]
                    outline-none
                    placeholder:text-[#77736b]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={loading}
                  aria-label={
                    isListening
                      ? "Stop voice input"
                      : "Start voice input"
                  }
                  title={
                    isListening
                      ? "Listening..."
                      : "Voice input"
                  }
                  className={`
                    hidden h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-transparent
                    transition-all duration-200
                    sm:flex
                    ${isListening
                      ? `
                          border-red-400/25
                          bg-red-950/30
                          text-red-300
                        `
                      : `
                          text-[#918c82]
                          hover:border-[#b08a4b]/20
                          hover:bg-[#17130d]
                          hover:text-[#c7a66a]
                        `
                    }
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  `}
                >
                  <Mic
                    size={17}
                    className={
                      isListening
                        ? "animate-pulse"
                        : ""
                    }
                  />
                </button>

                <button
                  type="submit"
                  disabled={
                    !question.trim() ||
                    loading ||
                    isListening
                  }
                  aria-label="Send question"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-[#c7a66a]
                    to-[#8f6b36]
                    text-[#17130d]
                    shadow-[0_6px_18px_rgba(199,166,106,0.10)]
                    transition-all duration-200
                    hover:from-[#dfc58f]
                    hover:to-[#b08a4b]
                    hover:shadow-[0_8px_22px_rgba(199,166,106,0.15)]
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

              <p className="mt-2 text-center text-[10px] text-[#68645d]">
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