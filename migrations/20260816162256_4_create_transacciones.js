/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("transactions", (table) => {
        table.increments('id')
        table.decimal("amount", 10, 2).notNullable()
        table.enum("type", ["income", "expense"]).notNullable()
        table.string("description", 255)
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.integer("account_id").unsigned().notNullable()
        table.foreign("account_id").references("id").inTable("accounts").onDelete("CASCADE")
        table.integer("category_id").unsigned().notNullable()
        table.foreign("category_id").references("id").inTable("categories").onDelete("CASCADE")
        
        
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropIfExistsTable("transactions")
}
