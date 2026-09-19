import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { validateParamId } from "../middlewares/validateParamId.middleware.js";
import { createBudget, getBudgets,getBudget } from "../controllers/budget.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", validateParamId, getBudget);
// router.put("/:id", validateParamId, updateBudget);
// router.delete("/:id", validateParamId, deletBudget);

export default router;
