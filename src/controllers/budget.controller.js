import {
    createBudgetServices,
    getActiveBudgetsServices,
    getBudgetByIdServices,
    updateBudgetServices,
    deleteBudgetServices
} from "../services/budget.services.js";

export const createBudget = async (req, res) => {
    const userId = req.user.id;
    const result = await createBudgetServices(req.body, userId);
    res.status(201).json(result);
};

export const getBudgets = async (req, res) => {
    const userId = req.user.id;
    const result = await getActiveBudgetsServices(userId);
    res.status(200).json(result);
};

export const getBudget = async (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;
    const result = await getBudgetByIdServices(budgetId, userId);
    res.status(200).json(result);
};

export const updateBudget = async (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;
    const result = await updateBudgetServices(budgetId, userId, req.body);
    res.status(200).json(result);
};

export const deleteBudget = async (req, res) => {
    const budgetId = req.params.id;
    const userId = req.user.id;
    const result = await deleteBudgetServices(budgetId, userId);
    res.status(200).json(result);
};
