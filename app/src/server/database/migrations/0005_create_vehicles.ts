import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.vehicles, (table) => {
      table.bigIncrements("id").primary().notNullable();
      table.bigInteger("client_id").unsigned().notNullable();
      table.string("make", 100).checkLength("<=", 100).notNullable();
      table.string("model", 100).checkLength("<=", 100).notNullable();
      table.integer("year", 4).notNullable();
      table.string("license_plate", 20).checkLength("<=", 20).notNullable();

      table
        .foreign("client_id")
        .references("id")
        .inTable(ETableNames.clients)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.vehicles}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.vehicles).then(() => {
    console.log(`# Dropped Table ${ETableNames.vehicles}`);
  });
}
