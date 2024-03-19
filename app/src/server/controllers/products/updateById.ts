import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IProduct } from "../../database/models";
import { ProductProvider } from "../../database/providers/products";
import { Knex } from "../../database/knex";
import { StockProvider } from "../../database/providers/stock";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IProduct, "id"> {
  quantity?: number;
} //Omit omite atributos

//Middleware de validação
export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      name: yup.string().required().min(3),
      price: yup.number().required(),
      quantity: yup.number().optional().min(0)
    })
  ),
  params: getSchema<IParamProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0)
    })
  )
}));

export const updateById = async (
  req: Request<IParamProps, {}, IBodyProps>,
  res: Response
) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "Id not informed"
      }
    });
  }
  const trx = await Knex.transaction();

  const { quantity, ...body } = req.body;

  const result = await ProductProvider.updateById(req.params.id, body, trx);

  if (result instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  if (quantity) {
    const resultStock = await StockProvider.updateByProductId(
      req.params.id,
      trx,
      quantity
    );

    if (resultStock instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: resultStock.message
        }
      });
    }
  }

  await trx.commit();

  return res.status(StatusCodes.NO_CONTENT).json(result);
};
