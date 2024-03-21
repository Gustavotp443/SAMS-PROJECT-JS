import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.clients).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const clientsToInsert = clientsBase;
  await knex(ETableNames.clients).insert(clientsToInsert);
};

const clientsBase = [
  {
    id: 1,
    user_id: 1,
    address_id: 1,
    name: "Cliente 1",
    email: "cliente1@email.com",
    phone: "12345678901"
  }
];
