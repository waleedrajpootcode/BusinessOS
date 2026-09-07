const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authTestRouter = require("./routes/authTest");
const marketIntelligenceRouter = require("./routes/marketIntelligence");
const aiTestRouter = require("./routes/aiTest");
const aiRouter = require("./routes/ai");
const { ensureRequestId, sendError } = require("./services/aiContract");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use((req, _res, next) => {
  ensureRequestId(req);
  next();
});

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "BusinessOS Backend",
    status: "healthy",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.use("/api/auth-test", authTestRouter);
  app.use("/api/ai-test", aiTestRouter);
}
app.use("/api/ai", aiRouter);

app.use(
  "/api/market-intelligence",
  marketIntelligenceRouter
);

app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    "body" in error &&
    req.path.startsWith("/api/ai")
  ) {
    return sendError(res, req, 400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  return next(error);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BusinessOS Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
