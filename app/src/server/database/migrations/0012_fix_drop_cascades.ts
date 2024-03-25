import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
  return knex.schema.alterTable(ETableNames.productItens, (table) => {
    table.dropForeign(["service_order_id"]);
    table.dropForeign(["product_id"]);

    table
      .foreign("service_order_id")
      .references("id")
      .inTable(ETableNames.serviceOrders)
      .onDelete("CASCADE"); // Restaurar a remoção em cascata

    table
      .foreign("product_id")
      .references("id")
      .inTable(ETableNames.products)
      .onDelete("CASCADE"); // Restaurar a remoção em cascata
  });
}

export async function down(knex: Knex) {
  return knex.schema.alterTable(ETableNames.productItens, (table) => {
    table.dropForeign(["service_order_id"]);
    table.dropForeign(["product_id"]);

    table
      .foreign("service_order_id")
      .references("id")
      .inTable(ETableNames.serviceOrders);

    table.foreign("product_id").references("id").inTable(ETableNames.products);
  });
}
