import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { ProductProvider } from "../../database/providers/products";
import { Knex } from "../../database/knex";
import { StockProvider } from "../../database/providers/stock";

interface IParamProps {
  id?: number;
}

//Middleware de validação
export const getByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    })
  )
}));

export const getById = async (req: Request<IParamProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "Id not informed"
      }
    });
  }

  const trx = await Knex.transaction();

  const result = await ProductProvider.getById(req.params.id, trx);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  const resultStock = await StockProvider.getByProductId(result.id, trx);

  if (resultStock instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: resultStock.message
      }
    });
  }

  return res.status(StatusCodes.OK).json({ ...result, quantity });
};
