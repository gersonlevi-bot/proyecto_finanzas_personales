import dotenv from "dotenv";
dotenv.config();

/**
 * @type { import("knex").Knex.Config["connection"] }
 */
const baseConnection = {
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
};

export default {
    development: {
        client: "mysql2",
        connection: baseConnection,
    },
    staging: {
        client: "mysql2",
        connection: baseConnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: { tableName: "knex_migrations" },
    },
    production: {
        client: "mysql2",
        connection: baseConnection,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    }
};
