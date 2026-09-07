const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY are required."
  );
}

function createAuthenticatedSupabaseClient(accessToken) {
  if (!accessToken) {
    throw new Error(
      "Supabase access token is required."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      accessToken: async () => accessToken,
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

module.exports = {
  createAuthenticatedSupabaseClient,
};