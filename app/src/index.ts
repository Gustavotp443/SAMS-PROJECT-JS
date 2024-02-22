import {server} from "./server/server";


//Rodar npm ts-node-dev ./src/index.ts
server.listen(3333, ()=>{
    console.log("App rodando!")
    console.log("Porta: 3333")
    console.log("http://localhost:3333")
});