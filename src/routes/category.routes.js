import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { validateParamId } from "../middlewares/validateParamId.middleware.js";
import { createCategory, getCategories, getCategory, updateCategory, deletCategory } from "../controllers/category.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createCategory);
router.get("/", getCategories); 
router.get("/:id", validateParamId, getCategory); 
router.put("/:id", validateParamId, updateCategory);
router.delete("/:id", validateParamId, deletCategory);

export default router;