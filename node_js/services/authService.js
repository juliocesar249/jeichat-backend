import { validaLogin } from '../helpers/validacao/login.js';
import autenticaUsuario from '../helpers/autenticaUsuario.js';
import UsuarioNaoEncontrado from '../errors/UsuarioNaoEncontrado.js';
import SenhaIncorreta from '../errors/SenhaIncorreta.js';
export default class AuthService {
    constructor(usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    async logaUsuario(email, senha) {
        validaLogin(email, senha);
        
        const usuario = await this.usuarioDAO.encontraUsuarioPorEmail(email);

        if(!usuario) throw new UsuarioNaoEncontrado();

        if(!await autenticaUsuario(usuario, senha)) throw new SenhaIncorreta();
    }
}