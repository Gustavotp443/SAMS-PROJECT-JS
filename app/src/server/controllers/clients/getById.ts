import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { Knex } from "../../database/knex";
import { ClientProvider } from "../../database/providers/clients";
import { AddressProvider } from "../../database/providers/address";

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
  const token = (req.headers.authorization ?? "").split(" ")[1];

  const result = await ClientProvider.getById(req.params.id, trx, token);

  if (result instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  const resultAddress = await AddressProvider.getById(result.address_id, trx);

  if (resultAddress instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: resultAddress.message
      }
    });
  }
  await trx.commit();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address_id, ...clientWithoutAddressId } = result;
  return res
    .status(StatusCodes.OK)
    .json({ ...clientWithoutAddressId, address: resultAddress });
};
