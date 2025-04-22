import pool from '../db/db.js';
import UsuarioDAO from '../dao/UsuarioDao.js';
import AuthService from '../services/AuthService.js';
import CadastroService from '../services/CadastroService.js';
import fs from 'fs';
import path from 'path';


const publicKey = fs.readFileSync(path.join(path.join(path.resolve('src', 'keys'), 'public.pem')),'utf-8');
const usuarioDAO = new UsuarioDAO(pool);
const cadastroService = new CadastroService(usuarioDAO);
const authService = new AuthService(usuarioDAO, publicKey);

export {
    cadastroService,
    authService
};
