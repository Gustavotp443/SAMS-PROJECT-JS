import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import {AnyObject, Maybe, ObjectSchema, ValidationError} from "yup";


type TProperty = "body"|"header"|"params"|"query";

//Usando Generics, ainda não sei qual é o <T>, retorna 1 schema
type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;

//RECORD é lista de types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TAllSchemas = Record<TProperty, ObjectSchema<any>>;

//Retorna todos os schemas
type TGetAllSchemas = (getSchema:TGetSchema) => Partial<TAllSchemas>

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;


export const validation:TValidation = (getAllSchemas) => async (req,res,next) =>{  
	const schemas = getAllSchemas(schema => schema);

	const errorsResult: Record<string, Record<string,string>> = {};

	Object.entries(schemas).forEach(([ key , schema ])=>{
		try{
			schema.validateSync(req[key as TProperty], { abortEarly: false });
		}catch(e){
			const yupError = e as ValidationError;
			const errors: Record<string, string> = {};
    
			yupError.inner.forEach( e => { //Mapeando lista de errors
				if(!e.path) return;
				errors[e.path] = e.message;
			});

			errorsResult[key] = errors;
		}
	});

	if(Object.entries(errorsResult).length === 0){
		return next(); //Execute next handdler na fila do endpoint
	}else{
		return res.status(StatusCodes.BAD_REQUEST).json({
			errors: errorsResult
		});	 
	}	
};