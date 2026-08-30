import { ErrorApp } from "./ErrorApp.js";

export function validateTypeAccount(type_account) {
    const type = ["yape", "cash", "bank"];
    if (!type.includes(type_account))
        throw new ErrorApp("Opcion no valida en tipo de cuenta", 400);
}

export function validateDescription(description) {
    if (description) {
        if (description.length > 255)
            throw new ErrorApp("El tamaño de la descripción excede el limite de caracteres permitidos",400);
    }
}
