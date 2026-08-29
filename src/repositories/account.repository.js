import { db } from "../config/db.js";

export async function saveAccount({ type_account, description, user_id }) {
    const [insertId] = await db("accounts").insert({
        type_account,
        description,
        user_id
    });

    return insertId;
}

export async function getAccountsByUser(userId) {
    const dataRequired = ["id", "description", "type_account", "created_at"];
    const rows = await db("accounts")
        .select(dataRequired)
        .where("user_id", userId)
        .whereNull("deleted_at");

    return rows;
}
