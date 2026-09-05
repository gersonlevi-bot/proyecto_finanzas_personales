/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("transactions", (table)=> {
        table.dropForeign("account_id");
        table.dropForeign("category_id");

        table.foreign("account_id").references("id").inTable("accounts").onDelete("RESTRICT");
        table.foreign("category_id").references("id").inTable("categories").onDelete("RESTRICT");

        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("id").inTable("users").onDelete("RESTRICT");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.dropForeign("account_id");
        table.dropForeign("category_id");
        table.dropForeign("user_id");

        table.foreign("account_id").references("id").inTable("accounts").onDelete("CASCADE");
        table.foreign("category_id").references("id").inTable("categories").onDelete("CASCADE");

        table.dropColumn("user_id");
    })
};
