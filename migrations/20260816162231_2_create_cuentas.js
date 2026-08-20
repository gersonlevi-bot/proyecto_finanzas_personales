/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("accounts", (table) => {
        table.increments('id')
        table.string("description", 255)
        table.enum("type_account", ["yape", "cash", "bank"]).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("deleted_at").defaultTo(null)
        table.integer("user_id").unsigned().notNullable()
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropIfExistsTable("accounts")
}
