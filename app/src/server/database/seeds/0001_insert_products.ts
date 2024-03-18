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
    price: 30.0
  },
  {
    id: 2,
    user_id: 1,
    name: "produto2",
    price: 25.0
  },
  {
    id: 3,
    user_id: 1,
    name: "produto3",
    price: 30.0
  },
  {
    id: 4,
    user_id: 1,
    name: "produto4",
    price: 25.0
  },
  {
    id: 5,
    user_id: 1,
    name: "produto5",
    price: 30.0
  },
  {
    id: 6,
    user_id: 1,
    name: "produto6",
    price: 25.0
  },
  {
    id: 7,
    user_id: 1,
    name: "produto7",
    price: 30.0
  },
  {
    id: 8,
    user_id: 1,
    name: "produto8",
    price: 25.0
  },
  {
    id: 9,
    user_id: 1,
    name: "produto9",
    price: 30.0
  },
  {
    id: 10,
    user_id: 1,
    name: "produto10",
    price: 25.0
  },
  {
    id: 11,
    user_id: 1,
    name: "produto11",
    price: 30.0
  },
  {
    id: 12,
    user_id: 1,
    name: "produto12",
    price: 25.0
  }
];
