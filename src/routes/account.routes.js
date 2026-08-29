import { Router } from "express";
import { authToken } from "../middlewares/authToken.middleware.js";
import { createAccount } from "../controllers/account.controller.js";

const router = Router();

router.use(authToken);

router.post("/", createAccount);

export default router;
