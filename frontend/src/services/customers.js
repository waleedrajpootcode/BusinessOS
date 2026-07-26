import { supabase } from "../lib/supabase";

export async function getCustomersCount() {
  const { count, error } = await supabase
    .from("customers")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(error);
    return 0;
  }

  return count;
}