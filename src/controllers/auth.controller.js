import { registerUser } from "../services/auth.services.js";

export const register = async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(result);
};
