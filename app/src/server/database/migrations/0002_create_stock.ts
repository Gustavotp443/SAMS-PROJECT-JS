import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.stock, (table) => {
      table.bigIncrements("id").primary().notNullable(); // INT AUTO_INCREMENT PRIMARY KEY
      table.bigInteger("product_id").unsigned().notNullable(); // INT
      table.integer("quantity").notNullable();

      table
        .foreign("product_id") //FK
        .references("id")
        .inTable(ETableNames.products)
        .onDelete("CASCADE");
    })
    .then(() => {
      console.log(`# Created Table ${ETableNames.stock}`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.stock).then(() => {
    console.log(`# Dropped Table ${ETableNames.stock}`);
  });
}
