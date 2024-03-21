import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { VehiclesProvider } from "../../database/providers/vehicles";
import { IVehicles } from "../../database/models/vehicles";

interface IBodyProps extends Omit<IVehicles, "id"> {}

//Middleware de validação
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      client_id: yup.number().required(),
      make: yup.string().required().max(100),
      model: yup.string().required().max(100),
      year: yup.number().required().min(1900).max(new Date().getFullYear()),
      license_plate: yup.string().required().max(20)
    })
  )
}));

export const create = async (
  req: Request<{}, {}, IBodyProps & { quantity?: number }>,
  res: Response
) => {
  try {
    const result = await VehiclesProvider.create(req.body);

    if (result instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: result.message
        }
      });
    }

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "An error occurred during the transaction"
      }
    });
  }
};
