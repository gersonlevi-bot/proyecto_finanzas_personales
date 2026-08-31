import { saveAccount, getAccountsByUser, getAccountById, updateAccountById } from "../repositories/account.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { validateTypeAccount, validateDescription } from "../utils/accountValidators.js";

export async function createAccountServices(dataAccount, userId) {
    const { type_account, description } = dataAccount;

    validateTypeAccount(type_account);
    validateDescription(description);

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

export async function getAccountByIdServices(accountId, userId) {
    const account = await getAccountById(accountId, userId);
    if(!account) throw new ErrorApp("La cuenta no existe", 404);

    return account;
};

export async function updateAccountServices(accountId, userId, updateData) {
    const { type_account, description } = updateData;
    validateTypeAccount(type_account);
    validateDescription(description);

    const isAccountExisting = await getAccountById(accountId, userId)
    if(!isAccountExisting) throw new ErrorApp("La cuenta no existe", 404);
    
    const account = await updateAccountById(accountId, userId, {
        type_account,
        description
    });
    if(account === 0){
        return { 
            message: "No se realizaron cambios (los datos ingresados son idénticos)", 
            changesApplied: false 
        }
    }
    
    return {
        message: "Cuenta actualizada con exito", 
        changesApplied: true
    }
};