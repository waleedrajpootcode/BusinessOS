import { supabase } from "../lib/supabase";

export async function getUsers() {

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;

}
export async function updateUserRole(id, role) {

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;

}
export async function updateUserStatus(id, status) {

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;

}