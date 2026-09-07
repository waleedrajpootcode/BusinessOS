const { createClient } = require("@supabase/supabase-js");
const { sendError } = require("../services/aiContract");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY are required for business context."
  );
}

async function requireBusinessContext(req, res, next) {
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

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        accessToken: async () => token,
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { data, error } = await supabase
      .from("profiles")
      .select("business_id")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "BusinessOS Business Context Error:",
        error
      );

      return sendError(res, req, 500, "BUSINESS_CONTEXT_FAILED", "Business context could not be verified.");
    }

    if (!data) {
      return sendError(res, req, 403, "PROFILE_NOT_FOUND", "User profile could not be found.");
    }

    if (!data.business_id) {
      return sendError(res, req, 403, "BUSINESS_NOT_ASSIGNED", "No business is assigned to this user.");
    }

    req.businessId = data.business_id;

    next();
  } catch (error) {
    console.error(
      "BusinessOS Business Context Middleware Error:",
      error
    );

    return sendError(res, req, 500, "BUSINESS_CONTEXT_FAILED", "Business context verification failed.");
  }
}

module.exports = {
  requireBusinessContext,
};
