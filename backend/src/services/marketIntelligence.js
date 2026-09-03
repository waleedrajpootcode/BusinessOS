/**
 * BusinessOS Market Intelligence Service
 *
 * Day 5 — Controlled external market-data service.
 *
 * IMPORTANT:
 * - Server-side service only.
 * - No frontend API keys.
 * - No database writes.
 * - No arbitrary SQL.
 * - Uses approved market provider adapter.
 * - Graceful error handling.
 */

const MAX_TOPIC_LENGTH = 120;
const MAX_RESULTS = 8;

const {
  fetchMarketArticles,
} = require("./marketProvider");

function normalizeTopic(topic) {
  return String(topic || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_TOPIC_LENGTH);
}

function buildBusinessSearchQuery(topic) {
  const normalizedTopic = normalizeTopic(topic);

  if (!normalizedTopic) {
    return null;
  }

  return `business OR market OR retail OR ecommerce ${normalizedTopic}`;
}

function normalizeArticles(articles) {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles
    .slice(0, MAX_RESULTS)
    .map((article) => ({
      title: String(article?.title || "").trim(),
      description: String(
        article?.description || ""
      ).trim(),
      url: String(article?.url || "").trim(),
      source: String(
        article?.source || ""
      ).trim(),
      publishedAt: String(
        article?.publishedAt || ""
      ).trim(),
    }))
    .filter(
      (article) =>
        article.title &&
        article.url
    );
}

async function createMarketIntelligenceResult({
  topic,
  timespan = "1day",
}) {
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

  const query =
    buildBusinessSearchQuery(
      normalizedTopic
    );

  try {
    const providerResult =
      await fetchMarketArticles({
        query,
        timespan,
      });

    if (!providerResult?.success) {
      return {
        success: false,
        type:
          providerResult?.type ||
          "market_provider_error",
        status: providerResult?.status || null,
        message:
          providerResult?.message ||
          "Fresh market information is temporarily unavailable.",
        articles: [],
      };
    }

    return {
      success: true,
      topic: normalizedTopic,
      query,
      source:
        providerResult?.provider ||
        "none",
      timespan,
      articles:
        normalizeArticles(
          providerResult?.articles
        ),
    };
  } catch (error) {
    console.error(
      "BusinessOS Market Intelligence Error:",
      error
    );

    return {
      success: false,
      type: "market_intelligence_error",
      message:
        "Fresh market information could not be retrieved right now.",
      articles: [],
    };
  }
}

module.exports = {
  createMarketIntelligenceResult,
  normalizeTopic,
  buildBusinessSearchQuery,
  normalizeArticles,
};