import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IAddress, IClient } from "../../database/models";
import { Knex } from "../../database/knex";
import { AddressProvider } from "../../database/providers/address";
import { ClientProvider } from "../../database/providers/clients";
import { DuplicateEmailError } from "../../utils/errors/duplicateEmailError";

interface IAddressProps extends Omit<IAddress, "id"> {}
interface IClientProps extends Omit<IClient, "id" | "address_id"> {}
interface IBodyProps extends IClientProps {
  address: IAddressProps;
}

//Middleware de validação
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      email: yup.string().required().email(),
      phone: yup
        .string()
        .required()
        .matches(/^\d{11}$/, "Phone must be 11 digits"),
      address: yup
        .object()
        .shape({
          // Aqui definimos o esquema para o objeto address
          street: yup.string().required(),
          city: yup.string().required(),
          state: yup.string().required(),
          code: yup
            .string()
            .required()
            .matches(/^\d{8}$/, "Code must be 8 digits"),
        })
        .required(), // Indicamos que o objeto address é obrigatório
    })
  ),
}));

export const create = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const trx = await Knex.transaction();

  try {
    const { address, ...client } = req.body;

    const addressResult = await AddressProvider.create(address, trx);

    if (addressResult instanceof Error) {
      await trx.rollback();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: addressResult.message,
        },
      });
    }

    const clientResult = await ClientProvider.create(
      client,
      addressResult.id,
      trx
    );

    if (clientResult instanceof Error) {
      await trx.rollback();
      if (clientResult instanceof DuplicateEmailError) {
        return res.status(StatusCodes.CONFLICT).json({
          errors: {
            email: clientResult.message,
          },
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          errors: {
            default: clientResult.message,
          },
        });
      }
    }

    await trx.commit();
    return res.status(StatusCodes.CREATED).json({
      ...clientResult,
      address: address,
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
