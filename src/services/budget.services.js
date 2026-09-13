import { db } from "../config/db.js";
import { findBudgetInDateRange, saveBudget } from "../repositories/budget.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { getCategoryByIdServices } from "./category.services.js";

export async function createBudgetServices(dataBudget, userId) {
    const { amount, time_start, time_end, category_id } = dataBudget;

    if(!time_start || !time_end || !category_id)
        throw new ErrorApp("Todos los campos son obligatorios.", 400);

    if(typeof amount !== "number" || amount <= 0)
        throw new ErrorApp("El monto debe ser de tipo número y mayor a 0", 400);

    if(time_start >= time_end)
        throw new ErrorApp("La fecha de inicio debe ser menor a la del fin", 400);
        
    const category = await getCategoryByIdServices(category_id, userId);

    const idBudget = await db.transaction( async (trx) => {
        const budgetExists = await findBudgetInDateRange(
            time_start,
            time_end,
            userId,
            category_id,
            trx
        );

        if(budgetExists) throw new ErrorApp("El presupuesto ya existe en ese rango de fechas.", 409);

        let budget;
        try {
            budget = await saveBudget({
                amount,
                time_start,
                time_end,
                category_id,
                user_id: userId,
            }, trx);
            
        } catch (error) {
            if(error.code === "ER_DUP_ENTRY" || error.errno === 1062)
                throw new ErrorApp("El presupuesto ya fue registrado por otro proceso",409);
            
            console.error("Error en la inserción física:", error);
            throw error;
        };
        
        return budget;
    })

    return {
        message: "Presupuesto creado con exito",
        idBudget
    };  
};
