import { supabase } from "../lib/supabase";

/* ===========================
   Get Employees
=========================== */

export async function getEmployees() {

  const { data, error } = await supabase

    .from("employees")

    .select("*")

    .order("created_at", { ascending: false });

  if (error) {

    console.error(error);

    return [];

  }

  return data;

}

/* ===========================
   Add Employee
=========================== */

export async function addEmployee(employee) {

  const { data, error } = await supabase

    .from("employees")

    .insert([employee])

    .select()

    .single();

  if (error) {

    throw error;

  }

  return data;

}

/* ===========================
   Update Employee
=========================== */

export async function updateEmployee(id, employee) {

  const { data, error } = await supabase

    .from("employees")

    .update(employee)

    .eq("id", id)

    .select()

    .single();

  if (error) {

    throw error;

  }

  return data;

}

/* ===========================
   Delete Employee
=========================== */

export async function deleteEmployee(id) {

  const { error } = await supabase

    .from("employees")

    .delete()

    .eq("id", id);

  if (error) {

    throw error;

  }

}