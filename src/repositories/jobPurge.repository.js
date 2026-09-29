import { db } from "../config/db.js";

export async function getExpiredUserIds(deadline) {
    const rows = await db("users")
        .pluck("id")
        .whereRaw("deleted_at IS NOT NULL AND deleted_at < ?", [deadline]);
    return rows;
}

export async function deleteTransactionsByUserId(connection, userId) {
    return connection("transactions").where("user_id", userId).del();
}

export async function deleteBudgetsByUserId(connection, userId) {
    return connection("budgets").where("user_id", userId).del();
}

export async function deleteUserById(connection, userId) {
    return connection("users").where("id", userId).del();
}
