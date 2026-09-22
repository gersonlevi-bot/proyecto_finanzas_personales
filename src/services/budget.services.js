import { db } from "../config/db.js";
import { findBudgetInDateRange, saveBudget, getActiveBudgets, getBudgetById } from "../repositories/budget.repository.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { getCategoryByIdServices } from "./category.services.js";
import { validateAmount, validateBudgetDates } from "../utils/budgetValidators.js";

export async function createBudgetServices(dataBudget, userId) {
    const { amount, time_start, time_end, category_id } = dataBudget;

    if(!time_start || !time_end || !category_id)
        throw new ErrorApp("Todos los campos son obligatorios.", 400);

    validateAmount(amount);
    validateBudgetDates(time_start, time_end);
    const category = await getCategoryByIdServices(category_id, userId);

    const idBudget = await db.transaction( async (trx) => {
        const isBudgetExisting = await findBudgetInDateRange(time_start, time_end, userId, category_id, trx, null);

        if(isBudgetExisting) throw new ErrorApp("El presupuesto ya existe en ese rango de fechas.", 409);

        let budget;
        try {
            budget = await saveBudget({ amount, time_start, time_end, category_id, user_id: userId }, trx);
            
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
    if (!budget) throw new ErrorApp("El presupuesto no existe", 404);
    
    return budget;
}

export async function updateBudgetServices (budgetId, userId, dataBudget) {
    const foundBudget = await getBudgetByIdServices(budgetId, userId);
    const effectiveData = { ... foundBudget, ...dataBudget };
    const { amount, time_start, time_end, category_id } = effectiveData;

    validateAmount(amount);
    validateBudgetDates(time_start, time_end);
    const category = await getCategoryByIdServices(category_id, userId);

    const isBudgetUpdated = await db.transaction(async (trx)=> {
        const isBudgetExisting = await findBudgetInDateRange(time_start, time_end, userId, category_id, trx, budgetId);
        if(isBudgetExisting)
            throw new ErrorApp("El presupuesto ya existe en ese rango de fechas.", 409);
            
        let affectedRows;

        try {
            affectedRows = await updateBudgetById(userId, { amount, time_start, time_end, category_id }, trx, budgetId);
            
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY" || error.erno === 1062) {
                throw new ErrorApp("El presupuesto ya fue registrado por otro proceso",409);
            };

            throw error;
        };
        
        return affectedRows;
    });

    if(isBudgetUpdated === 0) 
        return { 
            message: "No se realizaron cambios (los datos ingresados son idénticos)", 
            changesApplied: false 
        };

    return {
        message: "Presupuesto actualizado con exito", 
        changesApplied: true
    };
};
        