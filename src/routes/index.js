import { Router } from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import categoryRoutes from "./category.routes.js";
import transactionRoutes from "./transaction.routes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/cuenta", accountRoutes);
router.use("/categoria", categoryRoutes);
router.use("/transaccion", transactionRoutes);

export default router;
