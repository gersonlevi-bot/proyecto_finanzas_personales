import { db } from "../config/db.js";

export async function findBudgetInDateRange(time_start, time_end, user_id, category_id, connection) {
    return await connection("budgets")
        .where("user_id", user_id)
        .where("category_id", category_id)
        .where("time_start", "<=", time_end)   
        .where("time_end", ">=", time_start)
        .whereNull("deleted_at")
        .forUpdate()
        .first();
};

export async function saveBudget({ amount, time_start, time_end, user_id, category_id }, connection) {
    const [insert_id] = await connection("budgets").insert({
        amount,
        time_start,
        time_end,
        user_id,
        category_id
    });

    return insert_id;
};
