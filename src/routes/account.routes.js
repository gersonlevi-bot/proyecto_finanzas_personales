import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { createAccount, getAccounts, getAccount, updateAccount, deletedAccount } from "../controllers/account.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createAccount);
router.get("/", getAccounts); 
router.get("/:id", getAccount); 
router.put("/:id", updateAccount);
router.delete("/:id", deletedAccount);

export default router;
