import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";


interface IProduct {
    userId: number; 
    name: string;
    price: number;
  }

//Middleware de validação
export const createValidation = validation((getSchema)=> ({
	body:getSchema<IProduct>(yup.object().shape({
		userId: yup.number().required(),
		name: yup.string().required().min(3),
		price: yup.number().required()
	})),
}));


export const create = async (req: Request<{} ,{} ,IProduct>, res:Response) => {
	return res.json(StatusCodes.INTERNAL_SERVER_ERROR).send("Não Implementado!");
};