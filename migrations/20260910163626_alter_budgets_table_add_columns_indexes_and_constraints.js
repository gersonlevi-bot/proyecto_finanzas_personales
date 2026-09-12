/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("budgets", (table) => {
        table.dropForeign(["category_id"]);
        table.dropUnique(["time_period", "category_id"]);
        table.dropColumn("time_period");

        table.date("time_start").notNullable().after("amount");
        table.date("time_end").notNullable().after("time_start");
        table.timestamp("deleted_at").nullable().defaultTo(null).after("created_at");
        table.timestamp("updated_at").nullable().defaultTo(null).after("deleted_at");

        table.integer("user_id").unsigned().notNullable().after("category_id");
        table.foreign("user_id").references("id").inTable("users").onDelete("RESTRICT");
        table.foreign("category_id").references("id").inTable("categories").onDelete("RESTRICT");

        table.index(["user_id", "category_id", "time_start", "time_end"], "idx_budgets_performance");
        table.unique(["time_start", "time_end", "category_id", "user_id"]);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("budgets", (table) => {
        table.dropUnique(["time_start", "time_end", "category_id", "user_id"]);
        table.dropIndex(["user_id", "category_id", "time_start", "time_end"], "idx_budgets_performance");

        table.dropForeign(["category_id"]);
        table.dropForeign(["user_id"]);

        table.dropColumn("time_start");
        table.dropColumn("time_end");
        table.dropColumn("deleted_at");
        table.dropColumn("updated_at");
        table.dropColumn("user_id");

        table.date("time_period").notNullable().after("amount");
        table.foreign("category_id").references("id").inTable("categories").onDelete("CASCADE");
        table.unique(["time_period", "category_id"]);
    });
}