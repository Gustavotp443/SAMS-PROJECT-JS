import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.stock).count<[{ count: number }]>(
    "* as count"
  );

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const stockToInsert = stockBase;
  await knex(ETableNames.stock).insert(stockToInsert);
};

const stockBase = [
  {
    id: 1,
    product_id: 1,
    quantity: 1,
  },
  {
    id: 2,
    product_id: 2,
    quantity: 3,
  },
];
