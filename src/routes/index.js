import { Router } from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cuenta", accountRoutes)

export default router;
