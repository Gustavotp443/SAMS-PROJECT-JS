import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const getAll = async (filter:""): Promise<number | Error> =>{
	try{
		const [{count}] = await Knex(ETableNames.products)
			.where("name","like",`%${filter}%`)
			.count<[{count: number}]>("* as count");
		if(Number.isInteger(Number(count))) return Number(count);
		return new Error("Error when consulting total quantity of data!");

	}catch(e){
		console.error(e);
		return new Error("Error when consulting total quantity of data!");
	}
};