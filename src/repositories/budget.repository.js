import { db } from "../config/db.js";

export async function findBudgetInDateRange(
    searchedStartTime,
    searchedEndTime,
    user_id,
    category_id,
    connection,
    idBudget
) {
    const query = connection("budgets")
        .where("user_id", user_id)
        .where("category_id", category_id)
        .where("time_start", "<=", searchedEndTime)
        .where("time_end", ">=", searchedStartTime)
        .whereNull("deleted_at");

    if (idBudget) query.where("id", "!=", idBudget);

    return await query.forUpdate().first();
}

export async function saveBudget(
    { amount, time_start, time_end, user_id, category_id },
    connection
) {
    const [insert_id] = await connection("budgets").insert({
        amount,
        time_start,
        time_end,
        user_id,
        category_id
    });

    return insert_id;
}

function totalSpentByCategory() {
    return db("transactions")
        .select(db.raw("COALESCE(SUM(??), 0)", ["amount"]))
        .whereColumn("transactions.category_id", "budgets.category_id")
        .whereColumn("transactions.user_id", "budgets.user_id")
        .where("transactions.type", "=", "expense")
        .whereColumn("transactions.created_at", ">=", "budgets.time_start")
        .whereRaw("transactions.created_at < DATE_ADD(budgets.time_end, INTERVAL 1 DAY)")
        .as("totalSpentByCategory");
}

export async function getActiveBudgets(userId, currentDay) {
    const dataRequired = [
        "id",
        "amount",
        "time_start",
        "time_end",
        "created_at",
        "updated_at",
        "category_id"
    ];

    const rows = await db("budgets")
        .select([...dataRequired, totalSpentByCategory()])
        .where("budgets.user_id", userId)
        .whereNull("budgets.deleted_at")
        .where("budgets.time_start", "<=", currentDay)
        .whereRaw("? < DATE_ADD(budgets.time_end, INTERVAL 1 DAY)", [currentDay]);

    return rows;
}

export async function getBudgetById(BudgetId, userId) {
    const dataRequired = [
        "id",
        "amount",
        "time_start",
        "time_end",
        "created_at",
        "updated_at",
        "category_id"
    ];

    const row = await db("budgets")
        .select([...dataRequired, totalSpentByCategory()])
        .where("id", BudgetId)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();

    return row;
}

export async function updateBudgetById(
    budgetId,
    userId,
    { amount, time_start, time_end, category_id },
    connection
) {
    const affectedRow = await connection("budgets")
        .where("id", budgetId)
        .where("user_id", userId)
        .update({
            amount,
            time_start,
            time_end,
            category_id
        });

    return affectedRow;
}
