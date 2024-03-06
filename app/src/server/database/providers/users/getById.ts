import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUser } from "../../models";

export const getById = async (id: number): Promise<IUser | Error> => {
  try {
    const result = await Knex(ETableNames.users)
      .select("*")
      .where("id", "=", id)
      .first();

    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
