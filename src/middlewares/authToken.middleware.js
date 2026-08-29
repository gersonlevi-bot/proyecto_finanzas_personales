import jwt from "jsonwebtoken";
import { ErrorApp } from "../utils/ErrorApp.js";

import dotenv from "dotenv";
dotenv.config();

export function authToken(req, res, next) {
    const tokenHeader = req.headers.authorization
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) throw new ErrorApp("Acceso denegado. No proporciono el token", 401);

    const token = tokenHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET;
        const user = jwt.verify(token, secret);
        req.user = user;

        next();
    } catch (error) {
        throw new ErrorApp("Token invalido o expirado", 401);
    }
}
