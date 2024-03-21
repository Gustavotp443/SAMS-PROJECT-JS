import { getUserId } from "../../../utils";
import { ETableNames } from "../../ETableNames";
import { IClient } from "../../models";
import { Knex } from "../../knex";

export const getById = async (
  id: number,
  token: string
): Promise<IClient | Error> => {
  try {
    const uid = getUserId(token);
    const result = await Knex(ETableNames.vehicles)
      .join(
        ETableNames.clients,
        `${ETableNames.vehicles}.client_id`,
        "=",
        `${ETableNames.clients}.id`
      )
      .select(`${ETableNames.vehicles}.*`)
      .where(`${ETableNames.vehicles}.id`, "=", id)
      .andWhere(`${ETableNames.clients}.user_id`, "=", uid)
      .first();

    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
