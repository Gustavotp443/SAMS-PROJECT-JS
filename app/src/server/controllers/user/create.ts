import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";


interface IUser {
    name: string;
    email: string;
    password: string;
  }

//Middleware de validação
export const createValidation = validation((getSchema)=> ({
	body:getSchema<IUser>(yup.object().shape({
		name: yup.string().required().min(3),
		email: yup.string().required().email(),
		password: yup.string().required().min(6) // Altere os requisitos conforme necessário
	})),
}));


export const create = async (req: Request<{} ,{} ,IUser>, res:Response) => {
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Não Implementado!");
};