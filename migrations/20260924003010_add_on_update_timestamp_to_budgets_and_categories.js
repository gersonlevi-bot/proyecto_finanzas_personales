/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.raw(`
        ALTER TABLE \`categories\`
        MODIFY COLUMN \`updated_at\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    `);
    await knex.raw(`
        ALTER TABLE \`budgets\`
        MODIFY COLUMN \`updated_at\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.raw(`
        ALTER TABLE \`categories\`
        MODIFY COLUMN \`updated_at\` TIMESTAMP NULL DEFAULT NULL
    `);
    await knex.raw(`
        ALTER TABLE \`budgets\`
        MODIFY COLUMN \`updated_at\` TIMESTAMP NULL DEFAULT NULL
    `);
}
