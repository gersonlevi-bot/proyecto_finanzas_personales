import { db } from "../config/db.js";

export async function saveAccount({ type_account, description, user_id }) {
    const [insertId] = db("accounts").insert({
        type_account,
        description,
        user_id
    });

    return insertId;
}
