import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IStock } from "../../database/models";
import { StockProvider } from "../../database/providers/stock";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IStock, "id" | "product_id"> {} //Omit omite atributos

//Middleware de validação
export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      quantity: yup.number().required().moreThan(0),
    })
  ),
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const updateById = async (
  req: Request<IParamProps, {}, IBodyProps>,
  res: Response
) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "Id not informed",
      },
    });
  }

  const result = await StockProvider.updateById(req.params.id, req.body);
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message,
      },
    });
  }

  return res.status(StatusCodes.NO_CONTENT).json(result);
};
