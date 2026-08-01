import { supabase } from "../lib/supabase";

export async function getExpenses() {

  const { data, error } = await supabase

    .from("expenses")

    .select("*")

    .order("created_at", {
      ascending: false,
    });

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}

export async function saveExpense(expense) {

  const { data, error } = await supabase

    .from("expenses")

    .insert([expense])

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}

export async function updateExpense(id, expense) {

  const { data, error } = await supabase

    .from("expenses")

    .update(expense)

    .eq("id", id)

    .select()

    .single();

  if (error) {

    console.error(error);

    throw error;

  }

  return data;

}

export async function deleteExpense(id) {

  const { error } = await supabase

    .from("expenses")

    .delete()

    .eq("id", id);

  if (error) {

    console.error(error);

    throw error;

  }

} 