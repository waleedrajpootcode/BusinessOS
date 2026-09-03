/**
 * BusinessOS AI Gateway
 *
 * Day 5 — AI Brain Foundation
 *
 * Responsibilities:
 * - Validate user questions
 * - Provide a single AI entry point
 * - Delegate business queries to the existing safe router
 * - Keep AI provider/model details outside the UI
 *
 * Security:
 * - Read-only
 * - No direct database access
 * - No arbitrary SQL
 * - No financial writes
 * - No API keys/secrets
 * - Existing Supabase RLS remains the primary data security boundary
 */

import { routeBusinessQuery } from "./queryRouter";

const MAX_QUERY_LENGTH = 500;

/**
 * Normalize and validate incoming user questions.
 */
function normalizeQuestion(question) {
  return String(question || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_QUERY_LENGTH);
}

/**
 * Main BusinessOS AI Gateway.
 *
 * This is intentionally model-agnostic.
 * A real AI provider/model can be connected behind this
 * boundary later without changing the UI architecture.
 */
export async function askAIGateway(question) {
  const normalizedQuestion = normalizeQuestion(question);

  if (!normalizedQuestion) {
    return {
      success: false,
      type: "empty_query",
      message: "Please enter a business question.",
    };
  }

  if (String(question || "").trim().length > MAX_QUERY_LENGTH) {
    return {
      success: false,
      type: "query_too_long",
      message: "Please keep your question within 500 characters.",
    };
  }

  try {
    const result = await routeBusinessQuery(
      normalizedQuestion
    );

    return {
      ...result,
      gateway: "businessos-ai-gateway",
    };
  } catch (error) {
    console.error(
      "BusinessOS AI Gateway Error:",
      error
    );

    return {
      success: false,
      type: "gateway_error",
      message:
        "The AI assistant could not process your question right now.",
    };
  }
}