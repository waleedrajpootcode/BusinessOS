const express = require("express");
const cors = require("cors");
require("dotenv").config();

const marketIntelligenceRouter = require("./routes/marketIntelligence");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "BusinessOS Backend",
    status: "healthy",
  });
});

app.use(
  "/api/market-intelligence",
  marketIntelligenceRouter
);

app.listen(PORT, () => {
  console.log(
    `BusinessOS Backend running on http://localhost:${PORT}`
  );
});