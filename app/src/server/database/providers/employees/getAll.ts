/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IEmployees } from "../../models";
import { getUserId } from "../../../utils";


export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  id = 0,
  token: string
): Promise<IEmployees[] | Error> => {
  try {
    const userId = getUserId(token);
    
    const result = await Knex(ETableNames.employees)
      .select("*")
      .where("id", id)
      .orWhere("name", "like", `%${filter}%`)
      .andWhere("user_id", userId)
      .offset((page - 1) * limit)
      .limit(limit);


    if (id > 0 && result.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.employees)
        .select("*")
        .where("id", "=", id)
        .andWhere("user_id", userId)
        .first();


      if (resultById) return [...result, resultById];
    }


    return result;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
