/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("accounts", (table)=> {
        table.timestamp("updated_at").defaultTo(null).after("created_at")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("accounts", (table)=> {
        table.dropColumn("updated_at")
    })
}
