const express = require("express");

const {
  createMarketIntelligenceResult,
} = require("../services/marketIntelligence");

const router = express.Router();

router.get("/", async (req, res) => {
  const topic = String(req.query.topic || "").trim();

  if (!topic) {
    return res.status(400).json({
      success: false,
      type: "empty_topic",
      message: "Please provide a market topic.",
    });
  }

  if (topic.length > 120) {
    return res.status(400).json({
      success: false,
      type: "topic_too_long",
      message: "Market topic is too long.",
    });
  }

  const result =
    await createMarketIntelligenceResult({
      topic,
    });

  return res.status(200).json(result);
});

module.exports = router;