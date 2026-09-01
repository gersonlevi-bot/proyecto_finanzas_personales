import { db } from "../database/db.js";

export async function findCategoryByNameAndUser(nameCategory, userId) {
    const row = await db("categories")
        .where("name", nameCategory)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();
    return row;
}

export async function saveCategory({name,description,type_category,user_id}) {
    const [insertId] = await db("categories").insert({
        name,
        description,
        type_category,
        user_id
    });
    
    return insertId;
}
