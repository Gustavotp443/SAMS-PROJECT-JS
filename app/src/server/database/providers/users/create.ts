import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IUser } from "../../models";

export const create = async (user: Omit<IUser, "id" | "created_at">): Promise<IUser | Error> =>{
	try{
		const [result] = await Knex(ETableNames.users).insert(user).returning("*");

		if(typeof result === "object"){
			return result;
		} else if(typeof result === "number"){
			return result;
		}

		return new Error("Error when registering data!");

	}catch(e){
		console.error(e);
		return new Error("Error when registering data!");
	}

};