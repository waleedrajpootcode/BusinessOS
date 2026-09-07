const express = require("express");

const { requireAuth } = require("../middleware/auth");
const {
  requireBusinessContext,
} = require("../middleware/businessContext");

const router = express.Router();

router.get("/protected", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication verified successfully.",
    user_id: req.user.id,
  });
});

router.get(
  "/business-context",
  requireAuth,
  requireBusinessContext,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        "Authentication and business context verified successfully.",
      user_id: req.user.id,
      business_context_verified: true,
      business_id_available: Boolean(req.businessId),
    });
  }
);

module.exports = router;