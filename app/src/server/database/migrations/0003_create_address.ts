import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.address, (table) => {
      table.bigIncrements("id").primary().notNullable();
      table.string("street", 255).checkLength("<=", 255).notNullable();
      table.string("city", 100).checkLength("<=", 100).notNullable();
      table.string("state", 100).checkLength("<=", 100).notNullable();
      table.string("code", 8).checkLength("=", 8).notNullable();
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.address}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.address).then(() => {
    console.log(`# Dropped Table ${ETableNames.address}`);
  });
}
