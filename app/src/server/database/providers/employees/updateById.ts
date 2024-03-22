import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IEmployees } from "../../models";

export const updateById = async (
  id: number,
  employee: Omit<IEmployees, "id">
): Promise<IEmployees | Error> => {
  try {
    const [result] = await Knex(ETableNames.employees)
      .update(employee)
      .where("id", "=", id)
      .returning("*");

    if (result) return result;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
