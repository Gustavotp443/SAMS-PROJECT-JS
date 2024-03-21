import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IVehicles } from "../../database/models/vehicles";
import { VehiclesProvider } from "../../database/providers/vehicles";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IVehicles, "id"> {}

//Middleware de validação
export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      client_id: yup.number().required(),
      make: yup.string().required().max(100),
      model: yup.string().required().max(100),
      year: yup.number().required().min(1900).max(new Date().getFullYear()),
      license_plate: yup.string().required().max(20)
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

  const result = await VehiclesProvider.updateById(req.params.id, req.body);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).json(result);
};
