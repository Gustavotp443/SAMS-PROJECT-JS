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



export {router};