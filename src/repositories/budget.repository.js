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

function totalSpentByCategory(offset) {
    return db("transactions")
        .select(db.raw("COALESCE(SUM(??), 0)", ["amount"]))
        .whereColumn("transactions.category_id", "budgets.category_id")
        .whereColumn("transactions.user_id", "budgets.user_id")
        .where("transactions.type", "=", "expense")
        .whereRaw(
            "transactions.created_at >= CONVERT_TZ(TIMESTAMP(budgets.time_start), ?, '+00:00')",
            [offset]
        )
        .whereRaw(
            "transactions.created_at < CONVERT_TZ(TIMESTAMP(DATE_ADD(budgets.time_end, INTERVAL 1 DAY)), ?, '+00:00')",
            [offset]
        )
        .as("totalSpentByCategory");
}

export async function getActiveBudgets(userId, currentDay, offset) {
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
        .select([...dataRequired, totalSpentByCategory(offset)])
        .where("budgets.user_id", userId)
        .whereNull("budgets.deleted_at")
        .where("budgets.time_start", "<=", currentDay)
        .whereRaw("? < DATE_ADD(budgets.time_end, INTERVAL 1 DAY)", [currentDay]);

    return rows;
}

export async function getBudgetById(budgetId, userId, offset) {
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
        .select([...dataRequired, totalSpentByCategory(offset)])
        .where("id", budgetId)
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

export async function deleteBudgetById(budgetId, userId) {
    const affectedRow = await db("budgets")
        .where("id", budgetId)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .update({ deleted_at: db.fn.now() });

    return affectedRow;
}

export async function findBudgetById(budgetId, userId) {
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
        .select(dataRequired)
        .where("id", budgetId)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();

    return row;
}
