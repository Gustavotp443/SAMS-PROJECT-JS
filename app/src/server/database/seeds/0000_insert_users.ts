import { Knex } from "knex";
import { ETableNames } from "../ETableNames";
import { passwordCrypto } from "../../shared/services";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.users).count<[{ count: number }]>(
    "* as count"
  );
  if (!Number.isInteger(count) || Number(count) > 0) return;

  const usersToInsert = await Promise.all(
    usersBase.map(async (user) => {
      const hashedPassword = await passwordCrypto.hashPassword(user.password);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  await knex(ETableNames.users).insert(usersToInsert);
};

const usersBase = [
  {
    id: 1,
    name: "Gustavo Pardini",
    email: "gustavo@email.com",
    password: "12345678",
  },
];
