const { createClient } = require("@supabase/supabase-js");
const { sendError } = require("../services/aiContract");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY are required for backend authentication."
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return sendError(res, req, 401, "AUTHENTICATION_REQUIRED", "Authentication token is required.");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return sendError(res, req, 401, "INVALID_AUTH_TOKEN", "Authentication token is invalid.");
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendError(res, req, 401, "INVALID_AUTH_TOKEN", "Authentication session is invalid or expired.");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("BusinessOS Auth Middleware Error:", error);

    return sendError(res, req, 500, "AUTH_VERIFICATION_FAILED", "Authentication verification failed.");
  }
}

module.exports = {
  requireAuth,
};
