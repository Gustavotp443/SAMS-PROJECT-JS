import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.employees).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const employeesToInsert = employeesBase;
  await knex(ETableNames.employees).insert(employeesToInsert);
};

const employeesBase = [
  {
    id: 1,
    user_id: 1,
    name: "Funcionario1",
    email: "funcionario1@email.com",
    phone: "11222223333"
  }
];
