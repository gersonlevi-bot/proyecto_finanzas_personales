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

export async function getAccountById(accountId, userId) {
    const row = await db("accounts")
        .where("id", accountId)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();
    
    return row;
};

export async function updateAccountById(accountId, userId, { type_account, description }) {
    const rowAffected = await db("accounts")
        .where("id", accountId)
        .where("user_id", userId)
        .update({ 
            type_account, 
            description
        });

    return rowAffected;
};

export async function deleteAccountById(accountId, userId) {
    const rowAffected = await db("accounts")
        .where("id", accountId)
        .where("user_id", userId)
        .update({deleted_at: db.fn.now()});

    return rowAffected;
} ;


