import { createCategoryServices, getCategoriesSevices, getCategoryByIdSaervices, updateCategoryByIdServices, deletedCategoryByIdServices } from "../services/category.services.js";

export const createCategory = async (req, res) => {
    const userId = req.user.id;
    const result = await createCategoryServices(req.body, userId);
    res.status(201).json(result);
};

export const getCategories = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    const result = await getCategoriesSevices(categoryId, userId);
    res.status(200).json(result);
};

export const getCategory = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    const result = await getCategoryByIdSaervices(categoryId, userId);
    res.status(200).json(result);
};

export const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    const result = await updateCategoryByIdServices(categoryId, userId, req.body);
    res.status(200).json(result);
};

export const deletCategory = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;
    const result = await deletedCategoryByIdServices(categoryId, userId);
    res.status(200).json(result);
};
