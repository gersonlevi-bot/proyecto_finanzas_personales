import { ErrorApp } from "./ErrorApp.js";

export function validateAmount(amount) {
    if(typeof amount !== "number" || amount <= 0)
        throw new ErrorApp("El monto debe ser de tipo número y mayor a 0", 400);
}


export function validateBudgetDates(time_start, time_end) {
    // Fechas en formato ISO 8601
    const formatoISO = /^\d{4}-\d{2}-\d{2}$/;
    if(!formatoISO.test(time_start) || !formatoISO.test(time_end))
        throw new ErrorApp("Las fechas deben estar estrictamente en formato YYYY-MM-DD", 400);

    // Fechas con hora
    const startDate = new Date(`${time_start}T00:00:00`);
    const endDate = new Date(`${time_end}T00:00:00`);

    // Corrupción de fechas  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) 
        throw new ErrorApp("Una de las fechas provistas no es válida.", 400);

    // Fechas a número
    const [ startYear, startMonth, startDay ] = time_start.split("-").map(Number)
    const [ endYear, endMonth, endDay ] = time_end.split("-").map(Number)

    // Fechas correctas dentro del calendario
    if(startDate.getFullYear() !== startYear || (startDate.getMonth() + 1) !== startMonth || startDate.getDate() !== startDay)
        throw new ErrorApp("La fecha de inicio no es un día válido en el calendario", 400);

    if(endDate.getFullYear() !== endYear || (endDate.getMonth() + 1) !== endMonth || endDate.getDate() !== endDay)
        throw new ErrorApp("La fecha de fin no es un día válido en el calendario", 400);
    
    // Fecha inicio simpre mayor que la de fin
    if (startDate.getTime() >= endDate.getTime()) 
        throw new ErrorApp("La fecha de inicio debe ser menor a la del fin", 400);
}
