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
    const dataRequired = ["id", "amount", "type", "descripcion", "created_at"];
    const rows = await db("transactions")
        .select(dataRequired)
        .where("user_id", userId);
    
    return rows;
};

export async function getTransactionById(transactionId, userId) {
    const dataRequired = ["id", "amount", "type", "descripcion", "created_at"];
    const row = await db("transactions")
        .select(dataRequired)
        .where("id", transactionId)
        .where("user_id", userId)
        .first();

    return row;
};
