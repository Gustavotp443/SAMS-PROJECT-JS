import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export async function up(knex: Knex) {
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

export async function down(knex: Knex) {
  return knex.schema.alterTable(ETableNames.productItens, (table) => {
    table.dropForeign(["service_order_id"]);
    table.dropForeign(["product_id"]);

    table
      .foreign("service_order_id")
      .references("id")
      .inTable(ETableNames.serviceOrders)
      .onDelete("CASCADE");

    table
      .foreign("product_id")
      .references("id")
      .inTable(ETableNames.products)
      .onDelete("CASCADE");
  });
}
