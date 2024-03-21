import { Knex } from "./server/database/knex";
import server from "./server/server";

//Rodar npm ts-node-dev ./src/index.ts
//OBSERVA PORTA E RODA O PROJETO

const startServer = () => {
  server.listen(process.env.PORT || 3333, () => {
    console.log("App rodando!");
    console.log(`Porta: ${process.env.PORT || 3333}`);
    if (process.env.NODE_ENV === "development") {
      console.log(`http://localhost:${process.env.PORT || 3333}`);
    }
  });
};

if (process.env.IS_LOCALHOST !== "true") {
  console.log("Rodando migrations!");

  Knex.migrate
    .latest()
    .then(() => {
      Knex.seed
        .run()
        .then(() => startServer())
        .catch(console.log);
    })
    .catch(console.log);
} else {
  startServer();
}
