import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { DuplicateEmailError } from "../../../utils/errors/duplicateEmailError";
import { IVehicles } from "../../models/vehicles";

export const create = async (
  vehicle: Omit<IVehicles, "id">
): Promise<IVehicles | Error> => {
  try {
    const existingVehicle = await Knex(ETableNames.vehicles)
      .where({ license_plate: vehicle.license_plate })
      .first();

    if (existingVehicle) {
      throw new DuplicateEmailError();
    }

    const [result] = await Knex(ETableNames.vehicles)
      .insert(vehicle)
      .returning("*");

    if (typeof result === "object") {
      return result;
    }

    return new Error("Error when registering data!");
  } catch (e) {
    if (e instanceof DuplicateEmailError) {
      return e;
    }
    return new Error("Error when registering data!");
  }
};
