import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient, IEmployees } from "../../models";
import { DuplicateEmailError } from "../../../utils/errors/duplicateEmailError";

export const create = async (
  employee: Omit<IEmployees, "id">
): Promise<IClient | Error> => {
  try {
    const existingEmployee = await Knex(ETableNames.employees)
      .where({ email: employee.email })
      .first();

    if (existingEmployee) {
      throw new DuplicateEmailError();
    }
    const [result] = await Knex(ETableNames.employees)
      .insert(employee)
      .returning("*");

    if (typeof result === "object") {
      return result;
    }

    return new Error("Error when registering data!");
  } catch (e) {
    if (e instanceof DuplicateEmailError) {
      return e; // Propagate the DuplicateEmailError to be handled in the controller
    }
    return new Error("Error when registering data!");
  }
};
