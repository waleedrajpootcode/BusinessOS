const express = require("express");

const { requireAuth } = require("../middleware/auth");
const {
  requireBusinessContext,
} = require("../middleware/businessContext");

const router = express.Router();

router.get(
  "/context",
  requireAuth,
  requireBusinessContext,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "AI request security context verified successfully.",
      user_id: req.user.id,
      business_context_verified: true,
      business_id_available: Boolean(req.businessId),
    });
  }
);

module.exports = router;