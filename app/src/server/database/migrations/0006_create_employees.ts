import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.employees, (table) => {
      table.bigIncrements("id").primary().notNullable();
      table.bigInteger("user_id").unsigned().notNullable();
      table.string("name", 100).checkLength("<=", 100).notNullable();
      table.string("email", 100).checkLength("<=", 100).notNullable();
      table.string("phone", 11).checkLength("<=", 11).notNullable();

      table
        .foreign("user_id") // FK to user table
        .references("id")
        .inTable(ETableNames.users)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.employees}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.employees).then(() => {
    console.log(`# Dropped Table ${ETableNames.employees}`);
  });
}
