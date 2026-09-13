import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { createBudget } from "../controllers/budget.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createBudget);
// router.post("/", getBudgets);
// router.post("/:id", getBudget);
// router.post("/:id", updateBudget);
// router.post("/:id", deletBudget);

export default router;
