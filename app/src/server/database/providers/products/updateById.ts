import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";

export const updateById = async (id: number, product: Omit<IProduct, "id" | "user_id">): Promise<void | Error> =>{
	try{
		const result = await Knex(ETableNames.products).update(product).where("id","=","id");

		if(result > 0) return;

		return new Error("Error when updating data!");

	}catch(e){
		console.error(e);
		return new Error("Error when updating data!");	}
};