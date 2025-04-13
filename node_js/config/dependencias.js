import db from '../db/db.js';
import UsuarioDAO from '../dao/UsuarioDao.js';
import AuthService from '../services/AuthService.js';
import CadastroService from '../services/CadastroService.js';
import fs from 'fs';
import path from 'path'

const publicKey = fs.readFileSync(path.join(path.resolve('keys'), 'public.pem'), 'utf-8');
const usuarioDAO = new UsuarioDAO(db);
const cadastroService = new CadastroService(usuarioDAO);
const authService = new AuthService(usuarioDAO, publicKey);

export {
    cadastroService,
    authService
};
