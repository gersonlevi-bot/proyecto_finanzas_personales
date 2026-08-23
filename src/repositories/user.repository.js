import { db } from "../config/db.js";

export async function searchByEmail(email) {
    const user = await db("users").where("email", email).first();
    return user;
}

export async function saveUser({name, last_name, email, password_hash}) {
    const [insertId] = await db('users').insert({
        name,
        last_name,
        email,
        password_hash
    })

    return insertId
}
