import app from './src/app.js';
import { checkConnection } from "./src/config/db.js"

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

(async ()=> {
    await checkConnection()

    app.listen(PORT, ()=> {
        console.log(`Server listening in http://localhost:${PORT}`)
    })
})()