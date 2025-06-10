import {usuarioService, chatService, chaveService} from "../config/dependencias.js";
import validaChavePublica from "../helpers/validacao/chavePublica.js";

async function chat(ws, req, dados) {
    const chaveEmBase64 = req.headers.cookie.match(/chave_publica=.*/)[0].split('chave_publica=')[1];
    const chavePublica = `-----BEGIN PUBLIC KEY-----\n${chaveEmBase64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`
    validaChavePublica(chavePublica);
    await usuarioService.salvaChavePublica(chavePublica, dados.email);
    const chaveCriptografa = chaveService.criptografaChave(chavePublica).toString('base64');
    console.log('Nova conexão com o servidor estabelecida.');
    chatService.configuraConexao(ws);
    ws.send(JSON.stringify({evento: 'config', message: 'Chave criptográfica', chave: chaveCriptografa}));
}

export {chat};