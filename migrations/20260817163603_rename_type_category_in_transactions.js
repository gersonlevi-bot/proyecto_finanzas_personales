/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.renameColumn("type_category", "type")
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.renameColumn("type", "type_category")
    })
}
