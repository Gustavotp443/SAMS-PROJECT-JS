import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes";

//CONFIGURAÇÕES DO SERVIDOR
const server = express();

const originProd =
  process.env.NODE_ENV === "production"
    ? "https://sams-project-js.vercel.app"
    : "http://localhost:3000";

server.use(cors({ origin: originProd }));

server.use(express.json());
server.use(router);

export default server;
