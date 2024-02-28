import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.users).count<[{ count: number }]>(
    "* as count"
  );
  if (!Number.isInteger(count) || Number(count) > 0) return;
  const usersToInsert = usersBase;
  await knex(ETableNames.users).insert(usersToInsert);
};

const usersBase = [
  {
    name: "Gustavo Pardini",
    email: "gustavo@email.com",
    password: "12345678",
  },
];
