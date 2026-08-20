/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("budgets", (table) => {
        table.increments('id')
        table.decimal("amount", 10, 2).notNullable()
        table.date("time_period").notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.integer("category_id").unsigned().notNullable()
        table.foreign("category_id").references("id").inTable("categories").onDelete("CASCADE")
        table.unique(["time_period", "category_id"])
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropIfExistsTable("budgets")
}
