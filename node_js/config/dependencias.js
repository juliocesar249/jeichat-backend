import db from '../db/db.js';
import UsuarioDAO from '../dao/UsuarioDao.js';
import AuthService from '../services/authService.js';
import CadastroService from '../services/CadastroService.js';

const usuarioDAO = new UsuarioDAO(db);
const cadastroService = new CadastroService(usuarioDAO);
const authService = new AuthService(usuarioDAO);

export {
    cadastroService,
    authService
};
