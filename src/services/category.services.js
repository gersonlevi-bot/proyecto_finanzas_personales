import {
    saveCategory,
    findCategoryByNameAndUser,
    getCategoriesByUser,
    getCategoryById,
    updateCategoryById,
    deletedCategory
} from "../repositories/category.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { translateDbConflict } from "../utils/translateDbConflict.js";
import { validateTypeCategory } from "../utils/categoryValidators.js";
import { validateDescription } from "../utils/accountValidators.js";

export async function createCategoryServices(dataCategory, userId) {
    const { name, description, type_category } = dataCategory;
    if (!name || !type_category)
        throw new ErrorApp("Los campos nombre y tipo de categoría son obligatorios.", 400);

    validateTypeCategory(type_category);
    validateDescription(description);

    const foundCategory = await findCategoryByNameAndUser(name, userId);
    if (foundCategory) throw new ErrorApp("La categoría ya está registrada.", 409);

    let idCategory;
    try {
        idCategory = await saveCategory({
            name,
            description,
            type_category,
            user_id: userId
        });
    } catch (error) {
        translateDbConflict(error, "La categoría ya fue registrada por otro proceso");
    }

    return {
        message: "Categoria creada con exito",
        idCategory
    };
}

export async function getCategoriesSevices(userId) {
    const categories = await getCategoriesByUser(userId);
    return { categories };
}

export async function getCategoryByIdServices(categoryId, userId) {
    const category = await getCategoryById(categoryId, userId);
    if (!category) throw new ErrorApp("La categoría no existe.", 404);

    return category;
}

export async function updateCategoryByIdServices(categoryId, userId, dataCategory) {
    const { name, description, type_category } = dataCategory;
    if (!name || !type_category)
        throw new ErrorApp("Los campos nombre y tipo de categoría son obligatorios.", 400);

    validateTypeCategory(type_category);
    validateDescription(description);

    const foundCategory = await getCategoryById(categoryId, userId);
    if (!foundCategory) throw new ErrorApp("La categoría no existe.", 404);

    let affectedRows;

    try {
        affectedRows = await updateCategoryById(categoryId, userId, {
            name,
            description,
            type_category
        });
    } catch (error) {
        translateDbConflict(error, "La categoría ya fue registrada por otro proceso");
    }

    if (affectedRows === 0) {
        return {
            message: "No se realizaron cambios (los datos ingresados son idénticos).",
            changesApplied: false
        };
    }

    return {
        message: "Categoría actualizada con exito.",
        changesApplied: true
    };
}

export async function deletedCategoryByIdServices(categoryId, userId) {
    const isCategoryExisting = await getCategoryById(categoryId, userId);
    if (!isCategoryExisting) throw new ErrorApp("La categoría no existe.", 404);

    const affectedRows = await deletedCategory(categoryId, userId);
    if (affectedRows === 0) throw new ErrorApp("La categoría no existe.", 404);

    return { message: "Categoría dada de baja correctamente." };
}
