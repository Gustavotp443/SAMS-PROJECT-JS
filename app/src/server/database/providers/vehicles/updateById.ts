import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient } from "../../models";
import { IVehicles } from "../../models/vehicles";

export const updateById = async (
  id: number,
  vehicle: Omit<IVehicles, "id">
): Promise<IClient | Error> => {
  try {
    const [result] = await Knex(ETableNames.vehicles)
      .update(vehicle)
      .where("id", "=", id)
      .returning("*");

    if (result) return result;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
