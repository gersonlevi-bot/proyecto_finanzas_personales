import { db } from "../config/db.js";

export async function findCategoryByNameAndUser(nameCategory, userId) {
    const row = await db("categories")
        .where("name", nameCategory)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();
    return row;
};

export async function saveCategory({name,description,type_category,user_id}) {
    const [insertId] = await db("categories").insert({
        name,
        description,
        type_category,
        user_id
    });
    
    return insertId;
};

export async function getCategoriesByUser(userId) {
    const dataRequired = ["name", "description", "type_category", "created_at"];
    const rows = await db("categories")
        .select(dataRequired)
        .where("user_id", userId)
        .whereNull("deleted_at");
    
    return rows;
};

export async function getCategoryById(categoryId, userId) {
    const row = await db("categories")
        .where("id", categoryId)
        .where("user_id", userId)
        .whereNull("deleted_at")
        .first();

    return row;
};

export async function updateCategoryById(categoryId, userId, { name, description, type_category }) {
    const rowAffected = await db("categories")
        .where("id", categoryId)
        .where("user_id", userId)
        .update({
            name,
            description,
            type_category
        });

    return rowAffected;
};

export async function deletedCategory(categoryId, userId) {
    const rowAffected = await db("categories")
        .where("id", categoryId)
        .where("user_id", userId)
        .update({ deleted_at: db.fn.now() });

    return rowAffected;
};
