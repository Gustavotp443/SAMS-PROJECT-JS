import "dotenv/config";
import express from "express";
import { router } from "./routes";

//CONFIGURAÇÕES DO SERVIDOR
const server = express();
server.use(express.json());
server.use(router);

export { server };
