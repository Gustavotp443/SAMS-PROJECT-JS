import {Router} from "express";
import { UserController } from "./../controllers";
import { ProductController } from "../controllers/products";

const router = Router();

router.get("/", (_,res) => {
	return res.send("Olá bem vindo ao SAMS!");
});

//Users
router.post(
	"/user", 
	UserController.createValidation,
	UserController.create
);
router.get(
	"/user/:id", 
	UserController.getByIdValidation,
	UserController.getById
);
router.delete(
	"/user/:id", 
	UserController.deleteByIdValidation,
	UserController.deleteById
);

//Products
router.post(
	"/product", 
	ProductController.createValidation,
	ProductController.create
);
router.get(
	"/product", 
	ProductController.getAllValidation,
	ProductController.getAll
);
router.get(
	"/product/:id", 
	ProductController.getByIdValidation,
	ProductController.getById
);
router.put(
	"/product/:id", 
	ProductController.updateByIdValidation,
	ProductController.updateById
);
router.delete(
	"/product/:id", 
	ProductController.deleteByIdValidation,
	ProductController.deleteById
);



export {router};