import { createAccountServices, getAccountsServices, getAccountByIdServices, updateAccountServices, deleteAccountServices } from "../services/account.services.js";

export const createAccount = async (req, res) => {
    const userId = req.user.id
    const result = await createAccountServices(req.body, userId);
    res.status(201).json(result);
};

export const getAccounts = async (req, res) => {
    const userId = req.user.id;
    const result = await getAccountsServices(userId)
    res.status(200).json(result)
};

export const getAccount = async (req, res) => {
    const accountId = req.params.id;
    const userId = req.user.id;
    const result = await getAccountByIdServices(accountId, userId);
    res.status(200).json(result)
};

export const updateAccount = async (req, res) => {
    const accountId = req.params.id;
    const userId = req.user.id;
    const result = await updateAccountServices(accountId, userId, req.body);
    res.status(200).json(result)
}

export const deletedAccount = async (req, res) => {
    const accountId = req.params.id;
    const userId = req.user.id;
    const result = await deleteAccountServices(accountId, userId);
    res.status(200).json(result);
};
