import 'colors';
import cliente from '../db/redis.js';
import mongoose from '../db/mongo.js';
import CacheDAO from '../dao/CacheDAO.js';
import criaModel from '../models/Mensagens.js';
import poolAtivo from '../db/posgres.js';
import UsuarioDAO from '../dao/UsuarioDAO.js';
import MensagemDAO from '../dao/MensagemDAO.js';
import ChatService from '../services/ChatService.js';
import NonceService from "../services/NonceService.js";
import ChaveService from '../services/ChaveService.js';
import UsuarioService from "../services/UsuarioService.js";
import LimpezaService from "../services/LimpezaService.js";
import TarefaDAO from "../dao/TarefaDAO.js";

await cliente.connect();

const usuarioDAO = new UsuarioDAO(poolAtivo);
const cacheDAO = new CacheDAO(cliente);
const chaveService = new ChaveService(12, 13, cacheDAO);
const mensagemDAO = new MensagemDAO(criaModel(mongoose), cacheDAO);
const tarefaDAO = new TarefaDAO(poolAtivo);
const limpezaService = new LimpezaService(mensagemDAO, cacheDAO, tarefaDAO);
const usuarioService = new UsuarioService(usuarioDAO, cacheDAO);
const nonceService = new NonceService(usuarioDAO, cacheDAO);
const chatService = new ChatService(usuarioDAO, mensagemDAO, cacheDAO, nonceService);

// await chaveService.prepararChaves();

export {
    usuarioService,
    chatService,
    chaveService,
    limpezaService
};