import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient } from "../../models";
import { DuplicateEmailError } from "../../../utils/errors/duplicateEmailError";

export const create = async (
  client: Omit<IClient, "id">
): Promise<IClient | Error> => {
  try {
    const existingClient = await Knex(ETableNames.clients)
      .where({ email: client.email })
      .first();

    if (existingClient) {
      throw new DuplicateEmailError();
    }

    const [result] = await Knex(ETableNames.clients)
      .insert(client)
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
