import {saveCategory,findCategoryByNameAndUser,} from "../repositories/category.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { validateTypeCategory } from "../utils/categoryValidators.js";
import { validateDescription } from "../utils/accountValidators.js";

export async function createCategoryServices(dataCategory, userId) {
    const { name, description, type_category } = dataCategory;
    if (!name || !type_category)
        throw new ErrorApp("Los campos nombre y tipo de categoría son obligatorios",400);

    validateTypeCategory(type_category);
    validateDescription(description);

    const foundCategory = await findCategoryByNameAndUser(name, userId);
    if (foundCategory)
        throw new ErrorApp("La categoría ya está registrado", 409);

    let idCategory;
    try {
        idCategory = await saveCategory({
            name,
            description,
            type_category,
            user_id: userId
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062)
            throw new ErrorApp("La categoría ya fue registrada por otro proceso",409);

        console.error("Error en la inserción física:", error);
        throw error;
    }

    return { 
        message: "Categoria creada con exito", 
        idCategory 
    };
};
