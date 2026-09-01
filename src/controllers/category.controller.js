import { createCategoryServices } from "../services/category.services.js";

export const createCategory = async (req, res) => {
    const userId = req.user.id;
    const result = await createCategoryServices(req.body, userId);
    res.status(201).json(result);
};
