import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IStock } from "../../models";

export const updateById = async (
  id: number,
  stock: Omit<IStock, "id" | "product_id">
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.stock)
      .update(stock)
      .where("id", "=", id);

    if (result > 0) return;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
