import { ErrorApp } from "../utils/ErrorApp.js";

export function validateParamId(req, res, next) {
    const paramId = req.params?.id;
    const parsedParam = Number(paramId);

    if(Number.isNaN(parsedParam) || !Number.isInteger(parsedParam) || parsedParam <= 0)
        throw new ErrorApp("El params.id es invalido", 400);

    req.params.id = parsedParam;
    next();      
};