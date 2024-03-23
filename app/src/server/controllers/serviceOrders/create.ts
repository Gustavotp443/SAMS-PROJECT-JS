import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { Knex } from "../../database/knex";
import { IServiceOrder } from "../../database/models/serviceOrders";
import { ServiceOrdersProvider } from "../../database/providers/serviceOrders";
import { ProductItensProvider } from "../../database/providers/productItens";

interface IBodyProps extends Omit<IServiceOrder, "id" | "order_date"> {
  products?: IProductQuantity[];
}

interface IProductQuantity {
  product_id: number;
  quantity: number;
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      vehicle_id: yup.number(),
      employee_id: yup.number(),
      user_id: yup.number().required(),
      description: yup.string(),
      products: yup.array().of(
        yup.object().shape({
          product_id: yup.number().required(),
          quantity: yup.number().required()
        })
      )
    })
  )
}));

export const create = async (
  req: Request<{}, {}, IBodyProps & { products?: IProductQuantity[] }>,
  res: Response
) => {
  const trx = await Knex.transaction();

  const { products, ...body } = req.body;

  try {
    const result = await ServiceOrdersProvider.create(body, trx);

    if (result instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: result.message
        }
      });
    }

    const productItens = await ProductItensProvider.create(
      result.id,
      products || [],
      trx
    );

    if (productItens instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: productItens.message
        }
      });
    }

    await trx.commit();
    return res.status(StatusCodes.CREATED).json({
      ...result,
      productItens
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "An error occurred during the transaction"
      }
    });
  }
};
