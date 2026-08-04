import { supabase } from "../lib/supabase";

export async function getUserRole() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  console.log("Auth User ID:", user.id);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log("Profile Data:", data);
  console.log("Profile Error:", error);

  return data?.role || "staff";
}