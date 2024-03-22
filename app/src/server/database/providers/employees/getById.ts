import { getUserId } from "../../../utils";
import { ETableNames } from "../../ETableNames";
import { IEmployees } from "../../models";
import { Knex } from "../../knex";

export const getById = async (
  id: number,
  token: string
): Promise<IEmployees | Error> => {
  try {
    const uid = getUserId(token);
    const result = await Knex(ETableNames.employees)
      .select("*")
      .where("id", "=", id)
      .andWhere("user_id", uid)
      .first();

    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
