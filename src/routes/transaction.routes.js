import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { validateParamId } from "../middlewares/validateParamId.middleware.js";
import { createTransaction, getTransactions, getTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", validateParamId, getTransaction);

export default router;
