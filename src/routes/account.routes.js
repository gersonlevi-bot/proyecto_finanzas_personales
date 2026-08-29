import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { createAccount, getAccounts } from "../controllers/account.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createAccount);
router.get("/", getAccounts);

export default router;
