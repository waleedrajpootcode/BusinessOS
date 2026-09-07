/**
 * BusinessOS AI Provider
 *
 * Day 5 — Ollama Provider Adapter
 *
 * Responsibilities:
 * - Communicate with the configured local AI provider
 * - Send a prepared prompt to Ollama
 * - Return the model's text response
 * - Handle timeout/provider errors safely
 *
 * IMPORTANT:
 * - No database access
 * - No Supabase access
 * - No financial actions
 * - No business writes
 * - No frontend access
 * - No API keys
 */

const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "qwen3:1.7b";

const OLLAMA_TIMEOUT_MS = 60000;
const MAX_PROVIDER_ANSWER_LENGTH = 12000;


/* -------------------------------------------------------
   PROVIDER CONFIGURATION
------------------------------------------------------- */

function getOllamaConfig() {
  return {
    baseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
    timeoutMs: OLLAMA_TIMEOUT_MS,
  };
}


/* -------------------------------------------------------
   SAFE TEXT VALIDATION
------------------------------------------------------- */

function validatePrompt(prompt) {
  const normalizedPrompt = String(
    prompt || ""
  ).trim();

  if (!normalizedPrompt) {
    throw new Error(
      "AI prompt is required."
    );
  }

  return normalizedPrompt;
}


/* -------------------------------------------------------
   OLLAMA REQUEST
------------------------------------------------------- */

async function generateWithOllama(prompt) {
  const normalizedPrompt =
    validatePrompt(prompt);

  const controller =
    new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    OLLAMA_TIMEOUT_MS
  );

  try {
    const response = await fetch(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: normalizedPrompt,
          stream: false,
        }),

        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ollama provider returned HTTP ${response.status}.`
      );
    }

    const result =
      await response.json();

    const answer =
      String(result?.response || "").trim();

    if (!answer) {
      throw new Error(
        "Ollama provider returned an empty response."
      );
    }

    if (answer.length > MAX_PROVIDER_ANSWER_LENGTH) {
      throw new Error(
        "Ollama provider returned an answer that is too long."
      );
    }

    return {
      success: true,
      provider: "ollama",
      model: OLLAMA_MODEL,
      answer,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(
        "Ollama provider request timed out."
      );
    }

    if (/empty response|too long/i.test(error?.message || "")) {
      throw error;
    }

    console.error(
      "BusinessOS Ollama Provider Error:",
      error
    );

    throw new Error(
      "AI provider could not process the request."
    );
  } finally {
    clearTimeout(timeoutId);
  }
}


/* -------------------------------------------------------
   EXPORTS
------------------------------------------------------- */

module.exports = {
  getOllamaConfig,
  generateWithOllama,
};