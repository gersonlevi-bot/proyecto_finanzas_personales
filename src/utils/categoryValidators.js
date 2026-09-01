import { ErrorApp } from "../helpers/error.js";

export function validateTypeCategory(type_category) {
    const type = ["income", "expense"];
    if (!type.includes(type_category))
        throw new ErrorApp("Opcion no valida en tipo de categoria", 400);
};
