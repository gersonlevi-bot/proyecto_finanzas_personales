/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("categories", (table) => {
        table.increments('id')
        table.string("name", 255).notNullable()
        table.string("description", 255)
        table.enum("type_category", ["income", "expense"]).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("deleted_at").defaultTo(null)
        table.integer("user_id").unsigned().notNullable()
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE")
        table.unique(["name", "user_id"])
    })  
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropIfExistsTable("categories")
}
