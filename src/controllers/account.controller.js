import { createAccountServices } from "../services/account.services.js";

export const createAccount = async (req, res) => {
    const result = await createAccountServices(req.body);
    res.status(201).json(result);
};
