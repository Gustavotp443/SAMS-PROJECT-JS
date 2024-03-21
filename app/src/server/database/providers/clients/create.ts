import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient } from "../../models";
import { DuplicateEmailError } from "../../../utils/errors/duplicateEmailError";
import * as kn from "knex";

export const create = async (
  client: Omit<IClient, "id" | "address_id">,
  address_id: number,
  trx: kn.Knex.Transaction
): Promise<IClient | Error> => {
  try {
    const existingClient = await Knex(ETableNames.clients)
      .transacting(trx)
      .where({ email: client.email })
      .first();

    if (existingClient) {
      throw new DuplicateEmailError();
    }

    const clientData = { ...client, address_id };

    const [result] = await Knex(ETableNames.clients)
      .transacting(trx)
      .insert(clientData)
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
