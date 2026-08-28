import express from "express";
import cors from "cors";
import router from "../src/routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", router);

app.use(errorHandler);
export default app;
