import { supabase } from "../lib/supabase";
import { getCurrentBusinessId } from "./currentBusiness";


export async function getExpenses() {

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Get Expenses Error:", error);
    return [];
  }

  return data || [];
}


export async function saveExpense(expense) {

  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        ...expense,
        business_id: businessId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Save Expense Error:", error);
    throw error;
  }

  return data;
}


export async function updateExpense(id, expense) {

  const businessId = await getCurrentBusinessId();

  const { data, error } = await supabase
    .from("expenses")
    .update({
      ...expense,
      business_id: businessId,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update Expense Error:", error);
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
    console.error("Delete Expense Error:", error);
    throw error;
  }

}