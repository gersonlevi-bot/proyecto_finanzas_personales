import app from "./src/app.js";
import { checkConnection } from "./src/config/db.js";
import { startPurgeJob } from "./src/jobs/purge.job.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
    const isDbConnected = await checkConnection();
    if (!isDbConnected) {
        console.error("[FATAL] sin conexión a la BD");
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server listening in http://localhost:${PORT}`);
        startPurgeJob();
    });
})();
