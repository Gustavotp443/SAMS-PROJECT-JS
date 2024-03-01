import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.products).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const productsToInsert = productsBase;
  await knex(ETableNames.products).insert(productsToInsert);
};

const productsBase = [
  {
    id: 1,
    user_id: 1,
    name: "produto1",
    price: 30.0,
  },
  {
    id: 2,
    user_id: 1,
    name: "produto2",
    price: 25.0,
  },
];
