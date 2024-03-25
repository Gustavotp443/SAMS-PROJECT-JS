import { Router } from "express";
import { UserController } from "./../controllers";
import { ProductController } from "../controllers/products";
import { ensureAuthenticated } from "../shared/middlewares";
import { ClientController } from "../controllers/clients";
import { VehiclesController } from "../controllers/vehicles";
import { EmployeesController } from "../controllers/employees";
import { ServiceOrdersController } from "../controllers/serviceOrders";
import { ProductItemController } from "../controllers/productItens";

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

//client
router.post(
  "/client",
  ensureAuthenticated,
  ClientController.createValidation,
  ClientController.create
);

router.get(
  "/client",
  ensureAuthenticated,
  ClientController.getAllValidation,
  ClientController.getAll
);

router.get(
  "/client/:id",
  ensureAuthenticated,
  ClientController.getByIdValidation,
  ClientController.getById
);

router.put(
  "/client/:id",
  ensureAuthenticated,
  ClientController.updateByIdValidation,
  ClientController.updateById
);

router.delete(
  "/client/:id",
  ensureAuthenticated,
  ClientController.deleteByIdValidation,
  ClientController.deleteById
);

//Vehicles

router.post(
  "/vehicle",
  ensureAuthenticated,
  VehiclesController.createValidation,
  VehiclesController.create
);

router.get(
  "/vehicle",
  ensureAuthenticated,
  VehiclesController.getAllValidation,
  VehiclesController.getAll
);
router.get(
  "/vehicle/:id",
  ensureAuthenticated,
  VehiclesController.getByIdValidation,
  VehiclesController.getById
);

router.put(
  "/vehicle/:id",
  ensureAuthenticated,
  VehiclesController.updateByIdValidation,
  VehiclesController.updateById
);

router.delete(
  "/vehicle/:id",
  ensureAuthenticated,
  VehiclesController.deleteByIdValidation,
  VehiclesController.deleteById
);

//employees
router.get(
  "/employee",
  ensureAuthenticated,
  EmployeesController.getAllValidation,
  EmployeesController.getAll
);

router.get(
  "/employee/:id",
  ensureAuthenticated,
  EmployeesController.getByIdValidation,
  EmployeesController.getById
);

router.post(
  "/employee",
  ensureAuthenticated,
  EmployeesController.createValidation,
  EmployeesController.create
);

router.put(
  "/employee/:id",
  ensureAuthenticated,
  EmployeesController.updateByIdValidation,
  EmployeesController.updateById
);

router.delete(
  "/employee/:id",
  ensureAuthenticated,
  EmployeesController.deleteByIdValidation,
  EmployeesController.deleteById
);

//services order
router.get(
  "/serviceorder",
  ensureAuthenticated,
  ServiceOrdersController.getAllValidation,
  ServiceOrdersController.getAll
);

router.get(
  "/serviceorder/:id",
  ensureAuthenticated,
  ServiceOrdersController.getByIdValidation,
  ServiceOrdersController.getById
);

router.post(
  "/serviceorder",
  ensureAuthenticated,
  ServiceOrdersController.createValidation,
  ServiceOrdersController.create
);

router.put(
  "/serviceorder/:id",
  ensureAuthenticated,
  ServiceOrdersController.updateByIdValidation,
  ServiceOrdersController.updateById
);

router.delete(
  "/serviceorder/:id",
  ensureAuthenticated,
  ServiceOrdersController.deleteByIdValidation,
  ServiceOrdersController.deleteById
);

//PRODUCT ITENS
router.delete(
  "/productitem",
  ensureAuthenticated,
  ProductItemController.deleteByProductIdValidation,
  ProductItemController.deleteByProductId
);

router; //LOGIN && REGISTER
router.post(
  "/register",
  UserController.signupValidation,
  UserController.signup
);

router.post("/login", UserController.signinValidation, UserController.signin);

export { router };
