const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { requireBusinessContext } = require("../middleware/businessContext");
const { requireAdmin } = require("../middleware/admin");
const { processBusinessQuestion } = require("../services/aiGateway");
const {
  ensureRequestId,
  sendError,
  sendSuccess,
  validateAiRequest,
  validateGatewayResult,
} = require("../services/aiContract");

function createAiRouter(dependencies = {}) {
  const router = express.Router();
  const auth = dependencies.requireAuth || requireAuth;
  const businessContext = dependencies.requireBusinessContext || requireBusinessContext;
  const admin = dependencies.requireAdmin || requireAdmin;
  const processQuestion = dependencies.processBusinessQuestion || processBusinessQuestion;

  router.use((req, _res, next) => {
    ensureRequestId(req);
    next();
  });

  router.post("/", auth, businessContext, admin, async (req, res) => {
    try {
      const requestValidation = validateAiRequest(req.body);
      if (!requestValidation.valid) {
        return sendError(res, req, requestValidation.status, requestValidation.code, requestValidation.message);
      }

      const authorization = req.headers.authorization || "";
      const accessToken = authorization.slice("Bearer ".length).trim();
      const gatewayResult = await processQuestion({
        question: requestValidation.question,
        context: {
          userId: req.user.id,
          businessId: req.businessId,
          accessToken,
        },
      });
      const responseValidation = validateGatewayResult(gatewayResult);

      if (!responseValidation.valid) {
        return sendError(res, req, responseValidation.status, responseValidation.code, responseValidation.message);
      }

      return sendSuccess(res, req, responseValidation.data, { businessContextVerified: true });
    } catch (error) {
      console.error("BusinessOS AI Route Error:", error);
      return sendError(res, req, 500, "AI_REQUEST_FAILED", "The AI request could not be processed.");
    }
  });

  return router;
}

module.exports = createAiRouter();
module.exports.createAiRouter = createAiRouter;
