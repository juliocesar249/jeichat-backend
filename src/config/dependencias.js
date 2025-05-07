import 'colors';
import fs from 'fs';
import path from 'path';
import poolAtivo from '../db/posgres.js';
import mongoose from '../db/mongo.js';
import CacheDAO from '../dao/CacheDAO.js';
import criaModel from '../models/Mensagens.js';
import UsuarioDAO from '../dao/UsuarioDAO.js';
import MensagemDAO from '../dao/MensagemDAO.js';
import AuthService from '../services/AuthService.js';
import ChatService from '../services/ChatService.js';
import geraParDeChaves from "../helpers/geraParDeChaves.js";
import CadastroService from '../services/CadastroService.js';
import cliente from '../db/redis.js';

(function(){
    const caminhoChaves = path.resolve('./src','keys');
    const caminhoPrivateKey = path.join(caminhoChaves, 'private.pem');
    const caminhoPublicKey = path.join(caminhoChaves, 'public.pem');
    if(!fs.existsSync(caminhoPrivateKey) && !fs.existsSync(caminhoPublicKey)) {
        console.warn('Chaves não encontradas!');
        console.log('Gerando novas...');
        geraParDeChaves();
    }
})();

await cliente.connect();
const publicKey = fs.readFileSync(path.resolve('./src', 'keys', 'public.pem'),'utf-8');
const usuarioDAO = new UsuarioDAO(poolAtivo);
const cacheDAO = new CacheDAO(cliente);
const mensagemDAO = new MensagemDAO(criaModel(mongoose), cacheDAO);
const cadastroService = new CadastroService(usuarioDAO, cacheDAO);
const authService = new AuthService(usuarioDAO, publicKey); 
const chatService = new ChatService(mensagemDAO, cacheDAO);

export {
    cadastroService,
    authService,
    chatService,
    mensagemDAO,
};
