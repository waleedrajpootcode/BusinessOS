import { supabase } from "../lib/supabase";

export async function getBusinessSettings() {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function saveBusinessSettings(settings) {
  const existing = await getBusinessSettings();

  if (existing) {
    const { data, error } = await supabase
      .from("business_settings")
      .update(settings)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  const { data, error } = await supabase
    .from("business_settings")
    .insert([settings])
    .select()
    .single();

  if (error) throw error;

  return data;
}