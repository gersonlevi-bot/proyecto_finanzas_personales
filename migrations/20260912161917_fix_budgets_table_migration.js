/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("budgets", (table) => {
        table.dropColumn("time_period");
        table.unique(
            ["time_start", "time_end", "category_id", "user_id"],
            "budgets_unique_period_category_user",
        );
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("budgets", (table) => {
        table.dropUnique(
            null,
            "budgets_unique_period_category_user",
        );
        table.date("time_period").notNullable().after("amount");
    });
}
