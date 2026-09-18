import { supabase } from "../../lib/supabase";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 12000;
const QUESTION_ID_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

function failure(code, message) {
  return {
    success: false,
    data: null,
    meta: {},
    error: {
      code,
      message,
    },
  };
}

function messageForStatus(status) {
  if (status === 400) {
    return {
      code: "INVALID_AI_REQUEST",
      message: "Invalid AI request.",
    };
  }

  if (status === 401) {
    return {
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication required.",
    };
  }

  if (status === 403) {
    return {
      code: "ADMIN_ACCESS_REQUIRED",
      message: "Admin access required.",
    };
  }

  if (status === 429) {
    return {
      code: "AI_RATE_LIMITED",
      message: "AI request limit reached. Please try again later.",
    };
  }

  return {
    code: "AI_REQUEST_FAILED",
    message: "Business AI is temporarily unavailable.",
  };
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateSuccessEnvelope(payload) {
  if (
    !isObject(payload) ||
    payload.success !== true ||
    !isObject(payload.data) ||
    typeof payload.data.answer !== "string" ||
    !payload.data.answer.trim() ||
    payload.data.answer.length > MAX_ANSWER_LENGTH ||
    !isObject(payload.meta) ||
    payload.error !== null
  ) {
    return failure(
      "INVALID_AI_RESPONSE",
      "BusinessOS AI returned an invalid response."
    );
  }

  return payload;
}

function validateFailureEnvelope(payload, status) {
  if (
    isObject(payload) &&
    payload.success === false &&
    payload.data === null &&
    isObject(payload.error) &&
    typeof payload.error.code === "string" &&
    typeof payload.error.message === "string"
  ) {
    const safeStatusError = messageForStatus(status);

    return failure(
      safeStatusError.code,
      safeStatusError.message
    );
  }

  const safeStatusError = messageForStatus(status);
  return failure(
    safeStatusError.code,
    safeStatusError.message
  );
}

export async function askBusinessQuestion(
  question,
  questionId = undefined,
  responseLanguage = "auto"
) {
  if (typeof question !== "string") {
    return failure(
      "INVALID_AI_QUESTION",
      "Please enter a valid business question."
    );
  }

  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    return failure(
      "INVALID_AI_QUESTION",
      "Please enter a business question."
    );
  }

  if (normalizedQuestion.length > MAX_QUESTION_LENGTH) {
    return failure(
      "AI_QUESTION_TOO_LONG",
      "Please keep your question within 500 characters."
    );
  }

  if (
    questionId !== undefined &&
    (
      typeof questionId !== "string" ||
      !QUESTION_ID_PATTERN.test(questionId.trim()) ||
      questionId.trim().length > 64
    )
  ) {
    return failure(
      "INVALID_AI_QUESTION_ID",
      "Please select a valid BusinessOS question."
    );
  }

  const allowedResponseLanguages = new Set([
    "auto",
    "english",
    "urdu",
    "roman_urdu",
    "hindi",
    "roman_hindi",
    "mixed",
  ]);

  if (
    typeof responseLanguage !== "string" ||
    !allowedResponseLanguages.has(responseLanguage.trim())
  ) {
    return failure(
      "INVALID_RESPONSE_LANGUAGE",
      "Please select a valid response language."
    );
  }

  const normalizedResponseLanguage = responseLanguage.trim();

  let sessionResult;

  try {
    sessionResult = await supabase.auth.getSession();
  } catch {
    return failure(
      "AUTHENTICATION_REQUIRED",
      "Authentication required."
    );
  }

  const accessToken = sessionResult?.data?.session?.access_token;

  if (typeof accessToken !== "string" || !accessToken) {
    return failure(
      "AUTHENTICATION_REQUIRED",
      "Authentication required."
    );
  }

  let response;

  try {
    response = await fetch(`${BACKEND_URL}/api/ai`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        question: normalizedQuestion,
        ...(questionId !== undefined ? { questionId: questionId.trim() } : {}),
        responseLanguage: normalizedResponseLanguage,
      }),
    });
  } catch {
    return failure(
      "AI_NETWORK_ERROR",
      "Unable to connect to BusinessOS AI."
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    const safeStatusError = response.ok
      ? {
        code: "INVALID_AI_RESPONSE",
        message: "BusinessOS AI returned an invalid response.",
      }
      : messageForStatus(response.status);

    return failure(
      safeStatusError.code,
      safeStatusError.message
    );
  }

  if (!response.ok) {
    return validateFailureEnvelope(payload, response.status);
  }

  if (payload?.success === false) {
    return validateFailureEnvelope(payload, response.status);
  }

  return validateSuccessEnvelope(payload);
}
