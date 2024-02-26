import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../../database/models";
import { UserProvider } from "../../database/providers/users";


interface IBodyProps extends Omit<IUser, "id" | "created_at"> {}  //Omit omite atributos

//Middleware de validação
export const createValidation = validation((getSchema)=> ({
	body:getSchema<IBodyProps>(yup.object().shape({
		name: yup.string().required().min(3),
		email: yup.string().required().email(),
		password: yup.string().required().min(6) // Altere os requisitos conforme necessário
	})),
}));


export const create = async (req: Request<{} ,{} ,IUser>, res:Response) => {
	const result = await UserProvider.create(req.body);

	if(result instanceof Error){
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			errors:{
				default:result.message
			}
		});
	}

	return res.status(StatusCodes.CREATED).json(result);
};