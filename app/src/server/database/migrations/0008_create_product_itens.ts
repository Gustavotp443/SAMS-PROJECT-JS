import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";
export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.productItens, (table) => {
      table.bigIncrements("id").primary().notNullable();
      table.bigInteger("service_order_id").unsigned().notNullable();
      table.bigInteger("employee_id").unsigned().notNullable();
      table.bigInteger("product_id").unsigned().notNullable();
      table.integer("quantity").notNullable();

      table
        .foreign("service_order_id") // FK to user table
        .references("id")
        .inTable(ETableNames.serviceOrders)
        .onDelete("CASCADE");

      table
        .foreign("employee_id") // FK to user table
        .references("id")
        .inTable(ETableNames.employees)
        .onDelete("CASCADE");

      table
        .foreign("product_id") // FK to user table
        .references("id")
        .inTable(ETableNames.products)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.productItens}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.productItens).then(() => {
    console.log(`# Dropped Table ${ETableNames.productItens}`);
  });
}
