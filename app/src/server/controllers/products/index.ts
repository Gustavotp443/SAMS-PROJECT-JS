import * as create from "./create";
import * as getAll from "./getAll";

export const ProductController = {
	...create,  //add all exports with spread 
	...getAll
};