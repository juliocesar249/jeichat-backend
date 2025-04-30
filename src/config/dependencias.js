import fs from 'fs';
import path from 'path';
import pool from '../db/posgres.js';
import conexao from '../db/mongo.js';
import criaModel from '../models/Mensagens.js';
import UsuarioDAO from '../dao/UsuarioDAO.js';
import MensagemDAO from '../dao/MensagemDao.js';
import AuthService from '../services/AuthService.js';
import ChatService from '../services/ChatService.js';
import CadastroService from '../services/CadastroService.js';

const publicKey = fs.readFileSync(path.resolve('src', 'keys', 'public.pem'),'utf-8');
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
