import { createAccountServices } from "../services/account.services.js";

export const createAccount = async (req, res) => {
    const userId = req.user.id
    const result = await createAccountServices(req.body, userId);
    res.status(201).json(result);
};
