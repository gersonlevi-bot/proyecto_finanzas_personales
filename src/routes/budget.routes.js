import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { validateParamId } from "../middlewares/validateParamId.middleware.js";
import { createBudget } from "../controllers/budget.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createBudget);
// router.post("/", getBudgets);
// router.post("/:id", validateParamId, getBudget);
// router.post("/:id", validateParamId, updateBudget);
// router.post("/:id", validateParamId, deletBudget);

export default router;
