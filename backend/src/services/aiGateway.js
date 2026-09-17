/**
 * BusinessOS AI Gateway
 *
 * Day 5 — AI Intelligence Gateway
 *
 * Responsibilities:
 * - Receive a business question
 * - Validate the question
 * - Retrieve authorized business data
 * - Prepare that data for the reasoning layer
 * - Keep AI actions read-only
 *
 * IMPORTANT:
 * - No arbitrary SQL
 * - No database writes
 * - No financial actions
 * - No API keys here
 * - No cross-business data access
 */

const {
  AI_TOOL_REGISTRY,
  executeAiTool,
  getAiTool,
} = require("./aiTools");

const {
  reasonAboutBusiness,
} = require("./aiReasoning");
const {
  validateGatewayResult,
} = require("./aiContract");
const {
  executeGuidedQuestion,
  getHandler,
  validateResult,
} = require("./businessIntelligence");
const {
  createAuthenticatedSupabaseClient,
} = require("./supabaseClient");


const MAX_AI_QUERY_LENGTH = 500;

function classifyIntent(question) {
  const normalized = String(question || "")
    .normalize("NFKC")
    .toLowerCase();
  const actionPattern =
    /\b(refund|delete|remove|create|transfer)\b|\b(pay|purchase|sell|update|modify|adjust)\s+(the\s+)?(customer|invoice|payment|inventory|stock|record|data|product|sale|sales|supplier|business|account)\b|واپس\s+کریں|ادائیگی\s+کریں|حذف\s+کریں|بدلیں|भुगतान\s+करो|हटा\s+दो|बदल\s+दो/iu;

  if (actionPattern.test(normalized)) {
    return "unsupported_action";
  }

  if (
    /\b(mita|mitao|delete|hatao|badlo)\b|مٹا دو|مٹا دیں|حذف کریں|ہٹاؤ|हटाओ|बदलो/iu.test(
      normalized
    )
  ) {
    return "unsupported_action";
  }

  const hasSales = /sales|sale|revenue|bikri|فروخت|बिक्री/iu.test(normalized);
  const hasProfit = /profit|munafa|منافع|منافعہ|मुनाफ़ा|मुनाफा/iu.test(normalized);
  const hasExpenses = /expense|expenses|kharcha|خرچہ|खर्च/iu.test(normalized);
  const hasInventory = /inventory|stock|maal|اسٹاک|ذخیرہ|स्टॉक/iu.test(normalized);
  const hasCustomers = /customer|client|customers|گاہک|ग्राहक/iu.test(normalized);
  const hasPayments = /payment|payments|outstanding|receivable|udhaar|ادائیگی|واجبات|बकाया/iu.test(normalized);

  const hasSuppliers =
    /supplier|suppliers|vendor|vendors|سپلائر|سپلائرز|सप्लायर|सप्लायर्स/iu.test(
      normalized
    );
  const hasPaymentLanguage =
    /owe|owes|lena|len[aā]|dena|den[aā]|paisa|paise|رقم|لینی|لینا|دینی|دینا|رکم|लेना|देना|रकम/iu.test(
      normalized
    );
  const hasGrowth =
    /growth|growing|grow|badh|barh|بڑھ|ترقی|विकास|बढ़/iu.test(normalized);
  const hasMultilingualExpenses =
    /kharchay|kharche|اخراجات|खर्चे/iu.test(normalized);
  const hasMultilingualInventory =
    /cheezen|کم\s*اسٹاک|مصنوعات|कम\s*स्टॉक|उत्पाद/iu.test(normalized);
  const hasMultilingualCustomers =
    /بہترین گاہک|सबसे अच्छे ग्राहक/iu.test(normalized);
  const hasMultilingualOverview =
    /کاروبار|कारोबार/iu.test(normalized);

  if (hasSales && hasProfit) return "business_summary";
  if (hasSales) return "sales_analysis";
  if (hasProfit) return "profit_analysis";
  if (hasExpenses || hasMultilingualExpenses) return "expense_analysis";
  if (hasInventory || hasMultilingualInventory) return "inventory_analysis";
  if (hasSuppliers) return "supplier_analysis";
  if (hasPayments || hasPaymentLanguage) return "payment_analysis";
  if (hasCustomers || hasMultilingualCustomers) return "customer_analysis";
  if (hasGrowth) return "growth_analysis";
  if (hasMultilingualOverview || /summary|overview|overall|business|purchase|history|خرید|خریداری|खरीद|इतिहास|کاروبار|व्यवसाय/iu.test(normalized)) {
    return "business_analysis";
  }

  return "unknown";
}


/* -------------------------------------------------------
   SAFE QUESTION NORMALIZATION
------------------------------------------------------- */

function normalizeQuestion(question) {
  return String(question || "")
    .trim()
    .replace(/\s+/g, " ");
}


/* -------------------------------------------------------
   APPROVED AI TOOLS
------------------------------------------------------- */

function getApprovedTool(toolName) {
  return getAiTool(toolName);
}


/* -------------------------------------------------------
   AI GATEWAY
------------------------------------------------------- */

async function processBusinessQuestion(
  { question, questionId, context },
  dependencies = {}
) {
  const normalizedQuestion = normalizeQuestion(question);

  if (!normalizedQuestion) {
    return { success: false, status: 400, code: "QUESTION_REQUIRED", message: "Please enter a business question." };
  }

  if (normalizedQuestion.length > MAX_AI_QUERY_LENGTH) {
    return { success: false, status: 400, code: "QUESTION_TOO_LONG", message: "Please keep your question within 500 characters." };
  }

  if (!context) {
    return { success: false, status: 500, code: "AI_CONTEXT_REQUIRED", message: "Authenticated AI context is required." };
  }

  const intent = classifyIntent(normalizedQuestion);
  if (intent === "unsupported_action") {
    return {
      success: false,
      status: 400,
      code: "UNSUPPORTED_AI_ACTION",
      message: "Business actions are not available through AI.",
    };
  }

  try {
    let businessData;
    let dataUsed;

    if (questionId && getHandler(questionId)) {
      const executeGuided =
        dependencies.executeGuidedQuestion || executeGuidedQuestion;

      const supabaseClient =
        dependencies.createAuthenticatedSupabaseClient
          ? dependencies.createAuthenticatedSupabaseClient(context.accessToken)
          : createAuthenticatedSupabaseClient(context.accessToken);

      const guidedResult = await executeGuided({
        questionId,
        accessToken: context.accessToken,
        businessId: context.businessId,
        client: supabaseClient,
      });

      if (!guidedResult?.success || !validateResult(guidedResult.data)) {
        return {
          success: false,
          status: guidedResult?.status || 502,
          code: guidedResult?.code || "BI_DATA_UNAVAILABLE",
          message:
            guidedResult?.message ||
            "The Business Intelligence data could not be retrieved.",
        };
      }

      businessData = {
        businessIntelligence: guidedResult.data,
      };
      dataUsed = ["business_intelligence", questionId];
    } else {
      const executeTool = dependencies.executeTool || executeAiTool;
      const toolResult = await executeTool("business_snapshot", context);
      if (!toolResult?.success) {
        return {
          success: false,
          status: 500,
          code: toolResult?.code || "AI_TOOL_FAILED",
          message:
            toolResult?.message || "The AI tool could not be executed.",
        };
      }

      businessData = toolResult.data;
      dataUsed = ["business_snapshot"];
    }

    const reasoner = dependencies.reasoner || reasonAboutBusiness;
    const reasoningResult = await reasoner({ question: normalizedQuestion, businessData });

    if (!reasoningResult?.success) {
      return { success: false, status: 503, code: "AI_PROVIDER_UNAVAILABLE", message: "The AI service is temporarily unavailable." };
    }

    const validatedResult = validateGatewayResult({
      success: true,
      data: {
        answer: reasoningResult.answer,
        intent,
        dataUsed,
        reasoning: reasoningResult.reasoning,
        requiresConfirmation: false,
        actionAllowed: false,
      },
    });

    if (!validatedResult.valid) {
      return {
        success: false,
        status: validatedResult.status,
        code: validatedResult.code,
        message: validatedResult.message,
      };
    }

    return {
      success: true,
      data: validatedResult.data,
    };
  } catch (error) {
    console.error("BusinessOS AI Gateway Error:", error);
    return { success: false, status: 502, code: "AI_DATA_UNAVAILABLE", message: "The AI business information could not be retrieved." };
  }
}


/* -------------------------------------------------------
   EXPORTS
------------------------------------------------------- */

module.exports = {
  processBusinessQuestion,
  getApprovedTool,
  AI_TOOL_REGISTRY,
};
