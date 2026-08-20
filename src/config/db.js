import knex from "knex"
import config from "../../knexfile.js"
import dotenv from "dotenv"
dotenv.config()

const env = process.env.NODE_ENV || "development"
export const db = knex(config[env])

export async function checkConnection() {
    try {
        const connection = await db
        console.log(`Data Base started on port ${process.env.DBPORT}`)
    } catch (error) {
        console.error('Error on connection', error)
    }
}

