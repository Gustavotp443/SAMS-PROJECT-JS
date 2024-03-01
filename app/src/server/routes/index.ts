import { Router } from "express";
import { UserController } from "./../controllers";
import { ProductController } from "../controllers/products";
import { ensureAuthenticated } from "../shared/middlewares";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Olá bem vindo ao SAMS!");
});

//Users
router.get(
  "/user/:id",
  ensureAuthenticated,
  UserController.getByIdValidation,
  UserController.getById
);
router.delete(
  "/user/:id",
  ensureAuthenticated,
  UserController.deleteByIdValidation,
  UserController.deleteById
);

//Products
router.post(
  "/product",
  ensureAuthenticated,
  ProductController.createValidation,
  ProductController.create
);
router.get(
  "/product",
  ensureAuthenticated,
  ProductController.getAllValidation,
  ProductController.getAll
);
router.get(
  "/product/:id",
  ensureAuthenticated,
  ProductController.getByIdValidation,
  ProductController.getById
);
router.put(
  "/product/:id",
  ensureAuthenticated,
  ProductController.updateByIdValidation,
  ProductController.updateById
);
router.delete(
  "/product/:id",
  ensureAuthenticated,
  ProductController.deleteByIdValidation,
  ProductController.deleteById
);

//LOGIN && REGISTER
router.post(
  "/register",
  UserController.signupValidation,
  UserController.signup
);

router.post("/login", UserController.signinValidation, UserController.signin);

export { router };
