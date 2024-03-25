import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .table(ETableNames.productItens, (table) => {
      table.dropColumn("employee_id");
    })
    .then(() => {
      console.log(
        `# Removed employee_id column from ${ETableNames.productItens}`
      );
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .table(ETableNames.productItens, (table) => {
      table.bigInteger("employee_id").unsigned().nullable();

      table
        .foreign("employee_id")
        .references("id")
        .inTable(ETableNames.employees)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(
        `# Restored employee_id column in ${ETableNames.productItens}`
      );
    });
}
