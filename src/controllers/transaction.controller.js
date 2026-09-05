import { createTransactionServices, getTransationsServices, getTransactionServices } from "../services/transaction.services.js";

export const createTransaction = async (req, res) => {
    const userId = req.user.id;
    const result = await createTransactionServices(req.body, userId);
    res.status(201).json(result);
};

export const getTransactions = async (req, res) => {
    const userId = req.user.id;
    const result = await getTransationsServices(userId);
    res.status(200).json(result)
};

export const getTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user.id;
    const result = await getTransationServices(transactionId ,userId);
    res.status(200).json(result)
};
