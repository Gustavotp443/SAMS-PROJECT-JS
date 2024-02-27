import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IProduct } from "../../database/models";
import { ProductProvider } from "../../database/providers/products";

interface IBodyProps extends Omit<IProduct, "id"> {} //Omit omite atributos

//Middleware de validação
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      name: yup.string().required().min(3),
      price: yup.number().required(),
    })
  ),
}));

export const create = async (req: Request<{}, {}, IProduct>, res: Response) => {
  const result = await ProductProvider.create(req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.CREATED).json(result);
};
