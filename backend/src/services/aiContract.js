const { randomUUID } = require("crypto");

const MAX_QUESTION_LENGTH = 500;
const MAX_AI_ANSWER_LENGTH = 12000;
const MAX_REASONING_ITEMS = 20;
const MAX_REASONING_ITEM_LENGTH = 1000;
const ALLOWED_REQUEST_FIELDS = new Set(["question"]);

function ensureRequestId(req) {
  if (!req.requestId) req.requestId = randomUUID();
  return req.requestId;
}

function buildMeta(req, extra = {}) {
  return { requestId: ensureRequestId(req), asOf: new Date().toISOString(), ...extra };
}

function sendSuccess(res, req, data, meta = {}) {
  return res.status(200).json({ success: true, data, meta: buildMeta(req, meta), error: null });
}

function sendError(res, req, status, code, message, meta = {}) {
  return res.status(status).json({
    success: false,
    data: null,
    meta: buildMeta(req, meta),
    error: { code, message },
  });
}

function validateAiRequest(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { valid: false, status: 400, code: "INVALID_REQUEST", message: "Request body must be a JSON object." };
  }

  if (Object.keys(body).some((field) => !ALLOWED_REQUEST_FIELDS.has(field))) {
    return { valid: false, status: 400, code: "UNSUPPORTED_FIELD", message: "Only the question field is accepted." };
  }

  if (typeof body.question !== "string") {
    return { valid: false, status: 400, code: "INVALID_QUESTION", message: "Question must be a string." };
  }

  const question = body.question.trim().replace(/\s+/g, " ");
  if (!question) return { valid: false, status: 400, code: "QUESTION_REQUIRED", message: "Please enter a business question." };
  if (question.length > MAX_QUESTION_LENGTH) {
    return { valid: false, status: 400, code: "QUESTION_TOO_LONG", message: "Please keep your question within 500 characters." };
  }

  return { valid: true, question };
}

function validateGatewayResult(result) {
  if (!result || result.success !== true || !result.data) {
    return {
      valid: false,
      status: result?.status || 502,
      code: result?.code || "AI_PROCESSING_FAILED",
      message: result?.message || "The AI request could not be completed.",
    };
  }

  const {
    answer,
    intent,
    dataUsed,
    reasoning,
    actionAllowed,
    requiresConfirmation,
  } = result.data;
  if (
    typeof answer !== "string" || !answer.trim() || answer.length > MAX_AI_ANSWER_LENGTH ||
    typeof intent !== "string" || !Array.isArray(dataUsed) ||
    !reasoning ||
    typeof actionAllowed !== "boolean" || typeof requiresConfirmation !== "boolean" ||
    actionAllowed !== false || requiresConfirmation !== false
  ) {
    return { valid: false, status: 502, code: "INVALID_AI_RESPONSE", message: "The AI returned an invalid response." };
  }

  if (reasoning !== undefined) {
    const fields = ["facts", "calculations", "analysis", "recommendations", "uncertainty"];
    const reasoningKeys = Object.keys(reasoning).sort();
    const expectedKeys = [...fields].sort();
    if (
      reasoningKeys.length !== expectedKeys.length ||
      reasoningKeys.some((key, index) => key !== expectedKeys[index])
    ) {
      return { valid: false, status: 502, code: "INVALID_AI_RESPONSE", message: "The AI returned an invalid response." };
    }
    const validStructure = fields.every((field) => Array.isArray(reasoning[field]));
    const validItems = validStructure && fields.every((field) => (
      reasoning[field].length <= MAX_REASONING_ITEMS &&
      reasoning[field].every((item) =>
        typeof item === "string" &&
        item.trim() &&
        item.length <= MAX_REASONING_ITEM_LENGTH
      )
    ));
    const hasContent = validStructure && fields.some((field) => reasoning[field].length > 0);

    if (!validItems || !hasContent) {
      return { valid: false, status: 502, code: "INVALID_AI_RESPONSE", message: "The AI returned an invalid response." };
    }
  }

  return {
    valid: true,
    data: {
      answer: answer.trim(),
      intent,
      dataUsed: dataUsed.filter((item) => typeof item === "string"),
      ...(reasoning !== undefined ? { reasoning } : {}),
      actionAllowed,
      requiresConfirmation,
    },
  };
}

module.exports = {
  MAX_QUESTION_LENGTH,
  MAX_AI_ANSWER_LENGTH,
  MAX_REASONING_ITEMS,
  MAX_REASONING_ITEM_LENGTH,
  ensureRequestId,
  sendSuccess,
  sendError,
  validateAiRequest,
  validateGatewayResult,
};
