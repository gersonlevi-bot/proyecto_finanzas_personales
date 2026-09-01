import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { createCategory, getCategories, getCategory, updateCategory, deletCategory } from "../controllers/category.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createCategory);
router.get("/", getCategories); 
router.get("/:id", getCategory); 
router.put("/:id", updateCategory);
router.delete("/:id", deletCategory);

export default router;