/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient } from "../../models";
import { getUserId } from "../../../utils";
import * as kn from "knex";
import { AddressProvider } from "../address";


export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  id = 0,
  trx: kn.Knex.Transaction,
  token: string
): Promise<IClient[] | Error> => {
  try {
    const userId = getUserId(token);

    if (isNaN(userId) || isNaN(page) || isNaN(limit) || userId <= 0 || page <= 0 || limit <= 0) {
      throw new Error("Invalid parameters");
    }

    const result = await Knex(ETableNames.clients)
      .transacting(trx)
      .select("*")
      .where("id", Number(id))
      .orWhere("name", "like", `%${filter}%`)
      .andWhere("user_id", userId)
      .offset((page - 1) * limit)
      .limit(limit);

    const resultsWithAddress = await Promise.all(result.map(async (client) => {
      const resultAddress = await AddressProvider.getById(client.address_id, trx);
      if (resultAddress instanceof Error) {
        console.error("Error when getting address data", resultAddress);
        return new Error("Error when getting data!");      
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { address_id, ...clientWithoutAddressId } = client;
      
      return {
        ...clientWithoutAddressId,
        address: resultAddress
      };
    }));

    if (id > 0 && resultsWithAddress.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.clients)
        .transacting(trx)
        .select("*")
        .where("id", "=", id)
        .andWhere("user_id", userId)
        .first();


      if (resultById) return [...resultsWithAddress, resultById];
    }


    return resultsWithAddress;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
