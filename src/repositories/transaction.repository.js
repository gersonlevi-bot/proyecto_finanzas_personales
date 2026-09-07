import { db } from "../config/db.js";

export async function saveTransaction({ amount, type, description, account_id, category_id, user_id }) {
    const [insertId] = await db("transactions")
        .insert({
            amount,
            type,
            description,
            account_id,
            category_id,
            user_id
        })
    
    return insertId;
};

export async function getTransactionsByUser(userId) {
    const dataRequired = ["id", "amount", "type", "description", "created_at"];
    const rows = await db("transactions")
        .select(dataRequired)
        .where("user_id", userId);
    
    return rows;
};

export async function getTransactionById(transactionId, userId) {
    const dataRequired = ["id", "amount", "type", "description", "created_at"];
    const row = await db("transactions")
        .select(dataRequired)
        .where("id", transactionId)
        .where("user_id", userId)
        .first();

    return row;
};

export async function getAccountBalance(accountId, userId) {
    const balance = await db("transactions")
        .select(
            db.raw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income"),
            db.raw("COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense")
        )
        .where("account_id", accountId)
        .where("user_id", userId)
        .first();

    return balance;
};
