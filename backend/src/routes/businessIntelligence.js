const express = require("express");

const {
  ensureRequestId,
  sendError,
  sendSuccess,
} = require("../services/aiContract");

function createBusinessIntelligenceRouter(dependencies = {}) {
  const router = express.Router();
  const auth =
    dependencies.requireAuth || require("../middleware/auth").requireAuth;
  const businessContext =
    dependencies.requireBusinessContext ||
    require("../middleware/businessContext").requireBusinessContext;
  const admin =
    dependencies.requireAdmin || require("../middleware/admin").requireAdmin;
  const executeQuestion =
    dependencies.executeGuidedQuestion ||
    require("../services/businessIntelligence").executeGuidedQuestion;

  router.use((req, _res, next) => {
    ensureRequestId(req);
    next();
  });

  router.get(
    "/question/:questionId",
    auth,
    businessContext,
    admin,
    async (req, res) => {
      const forbiddenQueryFields = [
        "business_id",
        "businessId",
        "userId",
        "provider",
        "model",
      ];

      if (
        forbiddenQueryFields.some((field) =>
          Object.prototype.hasOwnProperty.call(req.query, field)
        )
      ) {
        return sendError(
          res,
          req,
          400,
          "UNSUPPORTED_FIELD",
          "Only the questionId path parameter is accepted."
        );
      }

      const authorization = req.headers.authorization || "";
      const accessToken = authorization
        .slice("Bearer ".length)
        .trim();

      const result = await executeQuestion({
        questionId: req.params.questionId,
        accessToken,
        businessId: req.businessId,
      });

      if (!result?.success) {
        return sendError(
          res,
          req,
          result.status || 502,
          result.code || "BI_REQUEST_FAILED",
          result.message || "The Business Intelligence request failed."
        );
      }

      return sendSuccess(res, req, result.data, {
        businessContextVerified: true,
        availability: result.data.availability,
      });
    }
  );

  return router;
}

module.exports = createBusinessIntelligenceRouter;
module.exports.createBusinessIntelligenceRouter =
  createBusinessIntelligenceRouter;
