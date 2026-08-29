import { saveAccount, getAccountsByUser } from "../repositories/account.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";

export async function createAccountServices(dataAccount, userId) {
    const type = ["yape", "cash", "bank"];
    const { type_account, description } = dataAccount;

    if (!type.includes(type_account)) throw new ErrorApp("Opcion no valida en tipo de cuenta", 400);
    if (description) {
        if (description.length > 255) throw new ErrorApp("El tamaño de la descripción excede el limite de caracteres permitidos",400);
    }

    const idAccount = await saveAccount({
        type_account,
        description,
        user_id: userId
    });

    return {
        message: "Cuenta creada con exito",
        idAccount
    };
}

export async function getAccountsServices(userId) {
    const accounts = await getAccountsByUser(userId); 
    return {accounts};
};
