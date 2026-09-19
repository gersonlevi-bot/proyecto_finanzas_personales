import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { validateParamId } from "../middlewares/validateParamId.middleware.js";
import { createAccount, getAccounts, getAccount, updateAccount, deletedAccount, getBalance } from "../controllers/account.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createAccount);
router.get("/", getAccounts); 
router.get("/:id", validateParamId, getAccount); 
router.get("/:id/balance", validateParamId, getBalance);
router.put("/:id", validateParamId, updateAccount);
router.delete("/:id", validateParamId, deletedAccount);

export default router;
