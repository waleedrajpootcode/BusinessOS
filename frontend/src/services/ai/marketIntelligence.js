/**
 * BusinessOS Frontend Market Intelligence
 *
 * Day 5 — Safe frontend gateway to the BusinessOS backend.
 *
 * IMPORTANT:
 * - No API key in frontend.
 * - No direct GNews request.
 * - Backend controls the external provider.
 * - Read-only external information.
 * - Graceful error handling.
 */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

const REQUEST_TIMEOUT_MS = 10000;
const MAX_TOPIC_LENGTH = 120;

function normalizeTopic(topic) {
  return String(topic || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_TOPIC_LENGTH);
}

export async function searchMarketIntelligence(
  topic,
  options = {}
) {
  const normalizedTopic = normalizeTopic(topic);

  if (!normalizedTopic) {
    return {
      success: false,
      type: "empty_topic",
      message:
        "Please provide a business or market topic.",
      articles: [],
    };
  }

  const timespan =
    String(options?.timespan || "1day");

  const params = new URLSearchParams({
    topic: normalizedTopic,
    timespan,
  });

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/market-intelligence?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

if (!response.ok) {
  return {
    success: false,
    type:
      data?.type ||
      "market_backend_error",
    status: response.status,
    message:
      data?.message ||
      "Market information is temporarily unavailable.",
    articles: [],
  };
}

    return {
      success: data?.success === true,
      type: data?.type || null,
      topic: data?.topic || normalizedTopic,
      query: data?.query || null,
      source: data?.source || null,
      timespan: data?.timespan || timespan,
      articles: Array.isArray(data?.articles)
        ? data.articles
        : [],
      message: data?.message || null,
    };
  } catch (error) {
    console.error(
      "BusinessOS Frontend Market Intelligence Error:",
      error
    );

    if (error?.name === "AbortError") {
      return {
        success: false,
        type: "market_timeout",
        message:
          "Market information request timed out.",
        articles: [],
      };
    }

    return {
      success: false,
      type: "market_network_error",
      message:
        "Market information could not be retrieved right now.",
      articles: [],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}