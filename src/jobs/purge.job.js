import cron from "node-cron";
import { purgeExpiredUsersServices } from "../services/jobPurge.services.js";

export function startPurgeJob() {
    cron.schedule(
        "0 8 * * *",
        async () => {
            try {
                console.log("Iniciando purga segura...");
                await purgeExpiredUsersServices();
                console.log("Purga finalizada.");
            } catch (error) {
                console.error("[CRITICAL] Error en la tarea programada:", error);
            }
        },
        {
            noOverlap: true,
            timezone: "UTC"
        }
    );
}
