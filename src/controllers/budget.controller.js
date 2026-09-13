import { createBudgetServices } from "../services/budget.services.js";

export const createBudget = async (req, res) => {
    const userId = req.user.id;
    const result = await createBudgetServices(req.body, userId);
    res.status(201).json(result)
};
