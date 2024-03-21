import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.clients, (table) => {
      table.bigIncrements("id").primary().notNullable(); // INT AUTO_INCREMENT PRIMARY KEY
      table.bigInteger("user_id").unsigned().notNullable(); // INT
      table.bigInteger("address_id").unsigned().notNullable(); // INT
      table.string("name", 100).checkLength("<=", 100).unique().notNullable();
      table.string("email", 100).checkLength("<=", 100).unique().notNullable(); // VARCHAR(100)
      table.string("phone", 11).checkLength("=", 11).notNullable(); // VARCHAR(20)

      // Assuming there's a table for users that client.user_id references
      table
        .foreign("user_id") // FK to user table
        .references("id")
        .inTable(ETableNames.users)
        .onDelete("CASCADE");

      // Assuming there's a table for addresses that client.address_id references
      table
        .foreign("address_id") // FK to address table
        .references("id")
        .inTable(ETableNames.address)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.clients}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.clients).then(() => {
    console.log(`# Dropped Table ${ETableNames.clients}`);
  });
}
