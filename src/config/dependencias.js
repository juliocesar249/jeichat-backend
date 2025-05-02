import fs from 'fs';
import path from 'path';
import pool from '../db/posgres.js';
import conexao from '../db/mongo.js';
import criaModel from '../models/Mensagens.js';
import UsuarioDAO from '../dao/UsuarioDAO.js';
import MensagemDAO from '../dao/MensagemDAO.js';
import AuthService from '../services/AuthService.js';
import ChatService from '../services/ChatService.js';
import geraParDeChaves from "../helpers/geraParDeChaves.js";
import CadastroService from '../services/CadastroService.js';

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

const publicKey = fs.readFileSync(path.resolve('./src', 'keys', 'public.pem'),'utf-8');
const usuarioDAO = new UsuarioDAO(pool);
const mensagemDAO = new MensagemDAO(criaModel(conexao));
const cadastroService = new CadastroService(usuarioDAO);
const authService = new AuthService(usuarioDAO, publicKey);
const chatService = new ChatService(mensagemDAO);

export {
    cadastroService,
    authService,
    chatService,
    mensagemDAO
};
