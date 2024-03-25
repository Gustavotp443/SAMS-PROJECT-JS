import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.serviceOrders, (table) => {
      table.bigInteger("vehicle_id").unsigned().nullable().alter();
    })
    .then(() => {
      console.log(`# Altered Table ${ETableNames.serviceOrders}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .alterTable(ETableNames.serviceOrders, (table) => {
      table.bigInteger("vehicle_id").unsigned().notNullable().alter();
    })
    .then(() => {
      console.log(
        `# Reverted alteration of Table ${ETableNames.serviceOrders}`
      );
    });
}
