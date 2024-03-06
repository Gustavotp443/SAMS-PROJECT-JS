import { Request, Response } from "express";
import * as yup from "yup";
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../../database/models";
import { UserProvider } from "../../database/providers/users";
import { passwordCrypto } from "../../shared/services";
import { JWTService } from "../../shared/services/JWTService";

interface IBodyProps extends Omit<IUser, "id" | "created_at" | "name"> {} //Omit omite atributos

//Middleware de validação
export const signinValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(
    yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(6) // Altere os requisitos conforme necessário
    })
  )
}));

export const signin = async (
  req: Request<{}, {}, IBodyProps>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await UserProvider.getByEmail(email);

  if (user instanceof Error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email or password not valid"
      }
    });
  }
  const passwordMatch = await passwordCrypto.verifyPassword(
    password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Email ou senha são inválidos"
      }
    });
  } else {
    const accessToken = JWTService.sign({ uid: user.id });
    if (accessToken === "JWT_SECRET_NOT_FOUND") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: {
          default: "Error generating access token"
        }
      });
    }

    return res.status(StatusCodes.OK).json({ accessToken });
  }

  //   return res.status(StatusCodes.CREATED).json(result);
};
