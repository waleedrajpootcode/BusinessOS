import { supabase } from "../lib/supabase";

export async function createInventoryMovement(movement) {
    const { data, error } = await supabase
        .from("inventory_movements")
        .insert([movement])
        .select()
        .single();

    if (error) {
        console.error("Inventory Movement Error:", error);
        throw error;
    }

    return data;
}

export async function getInventoryMovements(productId = null) {
    let query = supabase
        .from("inventory_movements")
        .select(`
            *,
            products (
                product_name
            )
        `)
        .order("created_at", {
            ascending: false,
        });

    if (productId) {
        query = query.eq(
            "product_id",
            Number(productId)
        );
    }

    const { data, error } = await query;

    if (error) {
        console.error(
            "Get Inventory Movements Error:",
            error
        );

        return [];
    }

    return data;
}