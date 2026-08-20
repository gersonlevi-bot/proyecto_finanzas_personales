/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments('id')
        table.string("name", 255).notNullable()
        table.string("last_name", 255).notNullable()
        table.string("email", 255).notNullable().unique()
        table.string("password_hash", 60).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("deleted_at").defaultTo(null) 
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropIfExistsTable("users")
}
