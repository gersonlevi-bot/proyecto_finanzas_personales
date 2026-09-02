/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`
        ALTER TABLE \`categories\` 
        ADD COLUMN \`updated_at\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    `)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("categories", (table)=> {
        table.dropColumn("updated_at")
    })
}
