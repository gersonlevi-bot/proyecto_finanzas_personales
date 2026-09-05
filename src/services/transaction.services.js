import { saveTransaction, getTransactionsByUser, getTransactionById } from "../repositories/transaction.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { validateTypeTransaction } from "../utils/transactionValidators.js";
import { validateDescription } from "../utils/accountValidators.js";
import { getAccountByIdServices } from "./account.services.js";
import { getCategoryByIdServices } from "./category.services.js";

export async function createTransactionServices(dataTransaction, userId) {
    const { amount, type, description, account_id, category_id } = dataTransaction;

    if(!amount || !type || !account_id || !category_id)
        throw new ErrorApp("Los campos son obligatorios (la descripcion es opcional)", 400);

    if(type(amount) !== Number || amount < 0) 
        throw new ErrorApp("El monto debe ser de tipo número y mayor que 0", 400);
    
    validateTypeTransaction(type);
    validateDescription(description);

    const account = await getAccountByIdServices(account_id, userId);
    const category = await getCategoryByIdServices(category_id, userId);

    const transaction = await saveTransaction({
        amount,
        type,
        description,
        account_id,
        category_id,
        user_id: userId
    });

    return {
        message: "Transaccion exitosa",
        transaction
    };
};

export async function getTransationsServices(userId) {
    const transactions = await getTransactionsByUser(userId);
    return { transactions };
};

export async function getTransactionServices(transactionId, userId) {
    const transaction = await getTransactionById(transactionId, userId);
    if(!transaction) throw new ErrorApp("La transacción no existe", 404);

    return transaction;
};
