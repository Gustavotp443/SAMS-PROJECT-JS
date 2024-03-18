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
    quantity: 1
  },
  {
    id: 2,
    product_id: 2,
    quantity: 3
  },
  {
    id: 3,
    product_id: 3,
    quantity: 1
  },
  {
    id: 4,
    product_id: 4,
    quantity: 3
  },
  {
    id: 5,
    product_id: 5,
    quantity: 1
  },
  {
    id: 6,
    product_id: 6,
    quantity: 3
  },
  {
    id: 7,
    product_id: 7,
    quantity: 1
  },
  {
    id: 8,
    product_id: 8,
    quantity: 3
  },
  {
    id: 9,
    product_id: 9,
    quantity: 1
  },
  {
    id: 10,
    product_id: 10,
    quantity: 3
  },
  {
    id: 11,
    product_id: 11,
    quantity: 1
  },
  {
    id: 12,
    product_id: 12,
    quantity: 3
  }
];
