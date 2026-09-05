import { ErrorApp } from "./ErrorApp.js";

export function validateTypeTransaction(type_transaction) {
    const type = ["income", "expense"];
    if (!type.includes(type_transaction))
        throw new ErrorApp("Opcion no valida en tipo de categoria", 400);
};
