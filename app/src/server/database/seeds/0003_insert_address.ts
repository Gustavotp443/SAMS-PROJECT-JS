import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.address).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const addressToInsert = addressBase;
  await knex(ETableNames.address).insert(addressToInsert);
};

const addressBase = [
  {
    id: 1,
    street: "Rua da Goiaba",
    city: "São Bernardo do Campo",
    state: "SP",
    code: "09000001"
  }
];
