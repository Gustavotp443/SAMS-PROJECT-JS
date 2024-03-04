import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IStock } from "../../models";

export const getById = async (id: number): Promise<IStock | Error> => {
  try {
    const result = await Knex(ETableNames.stock)
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
