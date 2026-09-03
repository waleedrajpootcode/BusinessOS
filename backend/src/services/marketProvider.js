/**
 * BusinessOS Market Provider
 *
 * Day 5 — External market provider adapter.
 *
 * IMPORTANT:
 * - Server-side only.
 * - API credentials never exposed to frontend.
 * - Provider can be replaced without changing AI architecture.
 * - No database writes.
 */

const MAX_RESULTS = 8;
const REQUEST_TIMEOUT_MS = 8000;

function normalizeProviderArticles(articles) {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles
    .slice(0, MAX_RESULTS)
    .map((article) => ({
      title: String(article?.title || "").trim(),
      description: String(article?.description || "").trim(),
      url: String(article?.url || "").trim(),
      source: String(
        article?.source?.name ||
        article?.source ||
        ""
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

async function fetchMarketArticles({
  query,
  timespan = "1day",
} = {}) {
  if (!query) {
    return {
      success: false,
      type: "empty_query",
      message:
        "A market search query is required.",
      articles: [],
    };
  }

  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      type: "provider_not_configured",
      message:
        "Market intelligence provider is not configured.",
      articles: [],
    };
  }

  const params = new URLSearchParams({
    q: query,
    max: String(MAX_RESULTS),
    lang: "en",
    apikey: apiKey,
  });

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      let providerMessage =
        "Market information provider request failed.";

      try {
        const errorData = await response.json();

        if (errorData?.errors?.length) {
          providerMessage =
            String(errorData.errors[0]);
        }
      } catch {
        // Ignore provider error parsing failure.
      }

      return {
        success: false,
        type: "provider_api_error",
        status: response.status,
        message: providerMessage,
        articles: [],
      };
    }

    const data = await response.json();

    return {
      success: true,
      provider: "gnews",
      query,
      timespan,
      articles: normalizeProviderArticles(
        data?.articles
      ),
    };
  } catch (error) {
    console.error(
      "BusinessOS Market Provider Error:",
      error
    );

    if (error?.name === "AbortError") {
      return {
        success: false,
        type: "provider_timeout",
        message:
          "Market information request timed out.",
        articles: [],
      };
    }

    return {
      success: false,
      type: "provider_network_error",
      message:
        "Market information could not be retrieved right now.",
      articles: [],
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  fetchMarketArticles,
  normalizeProviderArticles,
};