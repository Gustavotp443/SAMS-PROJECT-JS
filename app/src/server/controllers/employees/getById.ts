import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { EmployeesProvider } from "../../database/providers/employees";

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

  const token = (req.headers.authorization ?? "").split(" ")[1];

  const result = await EmployeesProvider.getById(req.params.id, token);

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return res.status(StatusCodes.OK).json(result);
};
