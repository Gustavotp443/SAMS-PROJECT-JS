import {server} from "./server/server";


//Rodar npm ts-node-dev ./src/index.ts
//OBSERVA PORTA E RODA O PROJETO
server.listen(process.env.PORT || 3333, ()=>{
  console.log("App rodando!");
  console.log(`Porta: ${process.env.PORT || 3333}`);
  if(process.env.NODE_ENV === "dev"){
    console.log(`http://localhost:${process.env.PORT || 3333}`);
  }
});