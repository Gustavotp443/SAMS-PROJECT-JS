import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUser } from "../../models";
import { DuplicateEmailError } from "../../../utils/errors/duplicateEmailError";
import { passwordCrypto } from "../../../shared/services";

export const create = async (
  user: Omit<IUser, "id" | "created_at">
): Promise<IUser | Error> => {
  try {
    const hashedPassword = await passwordCrypto.hashPassword(user.password);

    const existingUser = await Knex(ETableNames.users)
      .where({ email: user.email })
      .first();

    if (existingUser) {
      throw new DuplicateEmailError();
    }

    const [result] = await Knex(ETableNames.users)
      .insert({ ...user, password: hashedPassword })
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
