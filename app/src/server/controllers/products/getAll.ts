import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { ProductProvider } from "../../database/providers/products";
import { Knex } from "../../database/knex";

interface IQueryProps {
  id?: number;
  page?: number;
  limit?: number;
  filter?: string;
}

//Middleware de validação
export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(
    yup.object().shape({
      page: yup.number().optional().moreThan(0),
      limit: yup.number().optional().moreThan(0),
      id: yup.number().integer().optional().default(0),
      filter: yup.string().optional()
    })
  )
}));

export const getAll = async (
  req: Request<{}, {}, {}, IQueryProps>,
  res: Response
) => {
  const trx = await Knex.transaction();
  const token = (req.headers.authorization ?? "").split(" ")[1];

  const result = await ProductProvider.getAll(
    req.query.page || 1,
    req.query.limit || 20,
    req.query.filter || "",
    Number(req.query.id),
    trx,
    token
  );

  const count = await ProductProvider.count(req.query.filter, trx, token);

  if (result instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: result.message }
    });
  } else if (count instanceof Error) {
    await trx.rollback();
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: { default: count.message }
    });
  }
  await trx.commit();

  res.setHeader("access-control-expose-headers", "x-total-count");
  res.setHeader("x-total-count", count);

  return res.status(StatusCodes.OK).json(result);
};
