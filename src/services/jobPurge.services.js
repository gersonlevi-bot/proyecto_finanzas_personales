import { db } from "../config/db.js";
import {
    getExpiredUserIds,
    deleteBudgetsByUserId,
    deleteTransactionsByUserId,
    deleteUserById
} from "../repositories/jobPurge.repository.js";
import dotenv from "dotenv";
dotenv.config();

export async function purgeExpiredUsersServices() {
    let purgeTimeout = parseInt(process.env.PURGE_TIMEOUT, 10);

    if (isNaN(purgeTimeout) || purgeTimeout <= 0) {
        purgeTimeout = 30;
        console.warn(
            `[Config] PURGE_TIMEOUT corrupta o inválida ("${process.env.PURGE_TIMEOUT}"). Se usará el valor por defecto: ${purgeTimeout}.`
        );
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() - purgeTimeout);

    const usersIds = await getExpiredUserIds(deadline);
    if (usersIds.length === 0) {
        console.log("No hay cuentas inactivas que cumplan la condición para ser eliminadas");
        return;
    }

    // Trazabilidad predictiva global, especifica que y cuanto va a borrar
    console.log(`[ALERT - PURGA PREDICTIVA] 
            Se identificaron ${usersIds.length} usuarios para eliminación permanente anterior a ${deadline.toISOString()}. 
            IDs a eliminar: ${JSON.stringify(usersIds)}`);

    // Circuit Breaker para diseño seguro, definiendo humbral de usuarios a eliminar por pasada
    if (usersIds.length > 50) {
        console.warn(
            `[CRITICAL] Abortando purga. El conteo de registros (${usersIds.length}) supera el umbral seguro.`
        );
        return;
    }

    let i = 0;

    for (const user of usersIds) {
        try {
            // Trazabilidad atomica previa por usuario
            console.log(
                `[PURGA - PROCESANDO] Iniciando borrado permanente del usuario ID: ${user}`
            );

            await db.transaction(async (trx) => {
                await deleteTransactionsByUserId(trx, user);
                await deleteBudgetsByUserId(trx, user);
                await deleteUserById(trx, user);
            });

            i += 1;

            // Confirmación de exito parcial, asegurando que se elimino a el usuario y sus cascadas
            console.log(
                `[PURGA - ÉXITO INDIVIDUAL] El usuario ID: ${user} y sus cascadas fueron eliminados.`
            );
        } catch (error) {
            console.error(`Error purgando al usuario ${user}, saltando al siguiente...`, error);
        }
    }

    console.log(
        `[PURGA] Finalizado. Se eliminaron con éxito ${i} de ${usersIds.length} cuentas de usuario de forma permanente.`
    );
}
