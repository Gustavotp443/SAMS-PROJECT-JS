/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { getUserId } from "../../../utils";
import { IVehicles } from "../../models/vehicles";


export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  id = 0,
  token: string
): Promise<IVehicles[] | Error> => {
  try {
    const userId = getUserId(token);
    
    let query = Knex(ETableNames.vehicles)
      .join(ETableNames.clients, `${ETableNames.vehicles}.client_id`, "=", `${ETableNames.clients}.id`)
      .select(`${ETableNames.vehicles}.*`)
      .where(`${ETableNames.clients}.user_id`, userId);
    
    if (id > 0) {
      query = query.andWhere(`${ETableNames.vehicles}.id`, Number(id));
    } else if (filter) {
      query = query.andWhere(function() {
        this.where(`${ETableNames.vehicles}.model`, "like", `%${filter}%`)
          .orWhere(`${ETableNames.vehicles}.make`, "like", `%${filter}%`);
      });
    }
    
    const result = await query.offset((page - 1) * limit).limit(limit);
    
    return result;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
