import { db } from "../config/db.js";
import { findBudgetInDateRange, saveBudget, getActiveBudgets, getBudgetById } from "../repositories/budget.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { getCategoryByIdServices } from "./category.services.js";

export async function createBudgetServices(dataBudget, userId) {
    const { amount, time_start, time_end, category_id } = dataBudget;

    if(!time_start || !time_end || !category_id)
        throw new ErrorApp("Todos los campos son obligatorios.", 400);

    if(typeof amount !== "number" || amount <= 0)
        throw new ErrorApp("El monto debe ser de tipo número y mayor a 0", 400);
    
    // valida que las fechas vengas en formato ISO 8601
    const formatoISO = /^\d{4}-\d{2}-\d{2}$/;
    if(!formatoISO.test(time_start) || !formatoISO.test(time_end))
        throw new ErrorApp("Las fechas deben estar estrictamente en formato YYYY-MM-DD", 400);

    // convierte las fechas con hora
    const startDate = new Date(`${time_start}T00:00:00`);
    const endDate = new Date(`${time_end}T00:00:00`);

    // valida qe la fecha no sea corrupta con letras 
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) 
        throw new ErrorApp("Una de las fechas provistas no es válida.", 400);

    // desestructura las fechas y convirte en numeros
    const [ startYear, startMonth, startDay ] = time_start.split("-").map(Number)
    const [ endYear, endMonth, endDay ] = time_end.split("-").map(Number)

    // valida que las fechas sean correctas y validas en el calendario
    if(endDate.getFullYear() !== endYear || (endDate.getMonth() + 1) !== endMonth || endDate.getDate() !== endDay)
        throw new ErrorApp("La fecha de fin no es un día válido en el calendario", 400);
    
    if(startDate.getFullYear() !== startYear || (startDate.getMonth() + 1) !== startMonth || startDate.getDate() !== startDay)
        throw new ErrorApp("La fecha de inicio no es un día válido en el calendario", 400);
    
    // valida que la fecha inicio sea menor a la del fin
    if (startDate.getTime() >= endDate.getTime()) 
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

export async function getActiveBudgetsServices(userId) {
    const currentDay = new Date();
    const budgets = await getActiveBudgets(userId, currentDay);
    
    return { budgets };
};

export async function getBudgetByIdServices(budgetId, userId) {
    const budget = await getBudgetById(budgetId, userId);
    if (!budget) throw new ErrorApp("El presupuesto no existe", 400);
    
    return budget;
}
