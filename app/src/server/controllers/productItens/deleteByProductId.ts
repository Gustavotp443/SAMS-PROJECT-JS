import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { ProductItensProvider } from "../../database/providers/productItens";

interface IQueryProps {
  productId?: number;
  serviceOrderId?: number;
}

//Middleware de validação
export const deleteByProductIdValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      productId: yup.number().integer().required().moreThan(0),
      serviceOrderId: yup.number().integer().required().moreThan(0)
    })
  )
}));

export const deleteByProductId = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response
) => {
  if (!req.query.productId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "ProductId not informed"
      }
    });
  }
  if (!req.query.serviceOrderId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: "ServceOrderId not informed"
      }
    });
  }

  const result = await ProductItensProvider.deleteByProductId(
    Number(req.query.productId),
    Number(req.query.serviceOrderId)
  );
  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};
