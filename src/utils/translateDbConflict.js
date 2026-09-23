import { ErrorApp } from "./ErrorApp.js";

export function translateDbConflict(error, message) {
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) throw new ErrorApp(message, 409);

    throw error;
}
