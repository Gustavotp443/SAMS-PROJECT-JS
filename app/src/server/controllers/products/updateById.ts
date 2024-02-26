import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";


interface IParamProps {
    id?:number;
}

interface IBodyProps {
    userId: number; 
    name: string;
    price: number;
}

//Middleware de validação
export const updateByIdValidation = validation((getSchema)=> ({
	body:getSchema<IBodyProps>(yup.object().shape({
		userId: yup.number().required(),
		name: yup.string().required().min(3),
		price: yup.number().required()
	})),
	params:getSchema<IParamProps>(yup.object().shape({
		id: yup.number().integer().required().moreThan(0)
	})),
}));


export const updateById = async (req: Request<IParamProps>, res:Response) => {
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Não Implementado!");
};