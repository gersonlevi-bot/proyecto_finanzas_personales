import { createAccountServices, getAccountsServices } from "../services/account.services.js";

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