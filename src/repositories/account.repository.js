import { db } from "../config/db.js";

export async function saveAccount({ type_account, description, user_id }) {
    const [insertId] = await db("accounts").insert({
        type_account,
        description,
        user_id
    });

    return insertId;
}
