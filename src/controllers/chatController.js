import { chatService } from "../config/dependencias.js";

function chat(ws) {
    console.log('Nova conexão com o servidor estabelecida.');
    chatService.configuraConexao(ws);
}

export {chat};