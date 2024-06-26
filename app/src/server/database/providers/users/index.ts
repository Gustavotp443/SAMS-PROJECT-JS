import * as create from "./create";
import * as getById from "./getById";
import * as getByEmail from "./getByEmail";
import * as deleteById from "./deleteById";
export const UserProvider = {
  ...create, //add all exports with spread
  ...getById,
  ...deleteById,
  ...getByEmail
};
