import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IEmployees } from "../../database/models";
import { DuplicateEmailError } from "../../utils/errors/duplicateEmailError";
import { EmployeesProvider } from "../../database/providers/employees";

interface IBodyProps extends Omit<IEmployees, "id"> {}

//Middleware de validação
export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      user_id: yup.number().required(),
      name: yup.string().required().min(3),
      email: yup.string().required().email(),
      phone: yup
        .string()
        .required()
        .matches(/^\d{11}$/, "Phone must be 11 digits")
    })
  )
}));

export const create = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  try {
    const result = await EmployeesProvider.create(req.body);

    if (result instanceof Error) {
      if (result instanceof DuplicateEmailError) {
        return res.status(StatusCodes.CONFLICT).json({
          errors: {
            email: result.message
          }
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          errors: {
            default: result.message
          }
        });
      }
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
