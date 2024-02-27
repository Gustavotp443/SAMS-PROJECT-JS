import * as create from "./create";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
export const UserController = {
  ...create,  //add all exports with spread 
  ...getById,
  ...deleteById
};