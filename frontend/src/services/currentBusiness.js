import { supabase } from "../lib/supabase";

export async function getCurrentBusinessId() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Get Current User Error:", userError);
    throw userError;
  }

  if (!user) {
    throw new Error("User session not found. Please login again.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Get Business ID Error:", error);
    throw error;
  }

  if (!data?.business_id) {
    throw new Error(
      "Business is not assigned to this user. Please complete Business Setup."
    );
  }

  return data.business_id;
}