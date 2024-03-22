import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.serviceOrders, (table) => {
      table.bigIncrements("id").primary().notNullable();
      table.bigInteger("vehicle_id").unsigned().notNullable();
      table.bigInteger("employee_id").unsigned().notNullable();
      table.bigInteger("user_id").unsigned().notNullable();
      table.text("description").notNullable();
      table.timestamp("order_date").defaultTo(knex.fn.now()); // TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      table
        .foreign("vehicle_id") // FK to user table
        .references("id")
        .inTable(ETableNames.vehicles)
        .onDelete("CASCADE");

      table
        .foreign("employee_id") // FK to user table
        .references("id")
        .inTable(ETableNames.employees)
        .onDelete("CASCADE");

      table
        .foreign("user_id") // FK to user table
        .references("id")
        .inTable(ETableNames.users)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.serviceOrders}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.serviceOrders).then(() => {
    console.log(`# Dropped Table ${ETableNames.serviceOrders}`);
  });
}
