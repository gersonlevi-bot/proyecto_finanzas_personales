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
    flags: "-FOUND_ROWS",
    dateStrings: true,
    timezone: "Z"
};

const poolConfig = {
    afterCreate: function (conn, done) {
        conn.query("SET time_zone = '+00:00';", function (err) {
            if (err) done(err, conn);
            else done(null, conn);
        });
    }
};

export default {
    development: {
        client: "mysql2",
        connection: baseConnection,
        pool: poolConfig
    },
    staging: {
        client: "mysql2",
        connection: baseConnection,
        pool: {
            min: 2,
            max: 10,
            ...poolConfig
        },
        migrations: { tableName: "knex_migrations" }
    },
    production: {
        client: "mysql2",
        connection: baseConnection,
        pool: {
            min: 2,
            max: 10,
            ...poolConfig
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
};
