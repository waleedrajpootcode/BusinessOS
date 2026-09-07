const { createAuthenticatedSupabaseClient } = require("../services/supabaseClient");
const { sendError } = require("../services/aiContract");

async function requireAdmin(req, res, next) {
  try {
    if (!req.user?.id) {
      return sendError(res, req, 401, "AUTHENTICATION_REQUIRED", "Authenticated user is required.");
    }

    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return sendError(res, req, 401, "AUTHENTICATION_REQUIRED", "Authentication token is required.");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return sendError(res, req, 401, "INVALID_AUTH_TOKEN", "Authentication token is invalid.");
    }

    const supabase =
      createAuthenticatedSupabaseClient(token);

    const { data, error } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "BusinessOS Admin Authorization Error:",
        error
      );

      return sendError(res, req, 500, "ADMIN_AUTHORIZATION_FAILED", "Admin authorization could not be verified.");
    }

    if (!data) {
      return sendError(res, req, 403, "PROFILE_NOT_FOUND", "User profile could not be found.");
    }

    if (data.status !== "active") {
      return sendError(res, req, 403, "INACTIVE_ACCOUNT", "This account is not active.");
    }

    if (data.role !== "admin") {
      return sendError(res, req, 403, "ADMIN_ACCESS_REQUIRED", "Admin access is required for BusinessOS AI.");
    }

    req.userRole = data.role;
    req.userStatus = data.status;

    next();
  } catch (error) {
    console.error(
      "BusinessOS Admin Middleware Error:",
      error
    );

    return sendError(res, req, 500, "ADMIN_AUTHORIZATION_FAILED", "Admin authorization verification failed.");
  }
}

module.exports = {
  requireAdmin,
};
