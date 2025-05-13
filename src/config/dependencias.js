import 'colors';
import cliente from '../db/redis.js';
import mongoose from '../db/mongo.js';
import CacheDAO from '../dao/CacheDAO.js';
import criaModel from '../models/Mensagens.js';
import poolAtivo from '../db/posgres.js';
import UsuarioDAO from '../dao/UsuarioDAO.js';
import MensagemDAO from '../dao/MensagemDAO.js';
import AuthService from '../services/AuthService.js';
import ChatService from '../services/ChatService.js';
import ChaveService from '../services/ChaveService.js';
import CadastroService from '../services/CadastroService.js';

await cliente.connect();

const usuarioDAO = new UsuarioDAO(poolAtivo);
const cacheDAO = new CacheDAO(cliente);
const chaveService = new ChaveService(12, 13, cacheDAO);
const mensagemDAO = new MensagemDAO(criaModel(mongoose), cacheDAO);
const cadastroService = new CadastroService(usuarioDAO, cacheDAO);
const authService = new AuthService(usuarioDAO); 
const chatService = new ChatService(mensagemDAO, cacheDAO);

chaveService.inicializarChaves();

export {
    cadastroService,
    authService,
    chatService,
    mensagemDAO,
};
