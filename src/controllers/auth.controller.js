import { registerUser, loginServices } from "../services/auth.services.js";

export const register = async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(result);
};

export const login = async (req, res) => {
    const result = await loginServices(req.body)
    if(result.isDeactivated) {
        return res.status(403).json(result)
    }

    res.status(200).json(result)
}
