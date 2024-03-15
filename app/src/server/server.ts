import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";

//CONFIGURAÇÕES DO SERVIDOR
const server = express();
server.use(cors({ origin: "http://localhost:3000" }));

server.use(express.json());
server.use(router);

export { server };
