import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.productItens).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const productItensToInsert = productItensBase;
  await knex(ETableNames.productItens).insert(productItensToInsert);
};

const productItensBase = [
  {
    id: 1,
    service_order_id: 1,
    product_id: 1,
    quantity: 1
  }
];
