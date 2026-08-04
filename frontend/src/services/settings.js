import { supabase } from "../lib/supabase";

/* ===========================
   Load Settings
=========================== */

export async function getSettings() {

  const { data, error } = await supabase

    .from("settings")

    .select("*")

    .limit(1)

    .maybeSingle();

  if (error) {

    console.error(error);

    return null;

  }

  return data;

}

/* ===========================
   Save Settings
=========================== */

export async function saveSettings(settings) {

  const existing = await getSettings();

  if (existing) {

    const { data, error } = await supabase

      .from("settings")

      .update(settings)

      .eq("id", existing.id)

      .select()

      .single();

    if (error) {

      console.error(error);

      throw error;

    }

    return data;

  }

  const { data, error } = await supabase

    .from("settings")

    .insert([settings])

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}