import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IAddress, IClient } from "../../database/models";
import { Knex } from "../../database/knex";
import { ClientProvider } from "../../database/providers/clients";
import { AddressProvider } from "../../database/providers/address";

interface IParamProps {
  id?: number;
}

interface IAddressProps extends Omit<IAddress, "id"> {}
interface IClientProps extends Omit<IClient, "id" | "address_id"> {}
interface IBodyProps extends IClientProps {
  address: IAddressProps;
}
//Omit omite atributos

//Middleware de validação
export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      name: yup.string().required().min(3),
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
            .matches(/^\d{8}$/, "Code must be 8 digits")
        })
        .required() // Indicamos que o objeto address é obrigatório
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

  const { address, ...body } = req.body;

  const result = await ClientProvider.updateById(req.params.id, body, trx);

  if (result instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  const resultAddress = await AddressProvider.updateById(
    result.address_id,
    trx,
    address
  );

  if (resultAddress instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: resultAddress.message
      }
    });
  }

  await trx.commit();

  return res.status(StatusCodes.NO_CONTENT).json(result);
};
