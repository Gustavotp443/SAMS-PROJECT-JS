import * as signup from "./signup";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
import * as signin from "./signin";

export const UserController = {
  ...getById,
  ...deleteById,
  ...signin,
  ...signup,
};
