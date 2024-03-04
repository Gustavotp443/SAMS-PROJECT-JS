import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IAddress, IClient } from "../../database/models";
import { ProductProvider } from "../../database/providers/products";
import { StockProvider } from "../../database/providers/stock";
import { Knex } from "../../database/knex";

type IBodyProps = Omit<IClient, "id" | "address_id"> & Omit<IAddress, "id">; //Omit omite atributos

//Middleware de validação
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      email: yup.string().required().email(),
      phone: yup
        .string()
        .required()
        .min(11)
        .matches(/^|d{20}$)/, "Phone must be 11 digits"),

      street: yup.string.required(),
      city: yup.string().required(),
      state: yup.string().required(),
      code: yup.string().required().matches(/^|d{8}$)/, "Code must be 8 digits"),
      ,
    })
  ),
}));

export const create = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const trx = await Knex.transaction();

  try {
    const result = await ProductProvider.create(req.body, trx);

    if (result instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: result.message,
        },
      });
    }

    const stockResult = await StockProvider.create(result.id, trx);

    if (stockResult instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: stockResult.message,
        },
      });
    }

    await trx.commit();
    return res.status(StatusCodes.CREATED).json({
      ...result,
      quantity: stockResult.quantity,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "An error occurred during the transaction",
      },
    });
  }
};
