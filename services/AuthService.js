import { validaLogin } from '../helpers/validacao/login.js';
import autenticaUsuario from '../helpers/autenticaUsuario.js';
import UsuarioNaoEncontrado from '../errors/UsuarioNaoEncontrado.js';
import SenhaIncorreta from '../errors/SenhaIncorreta.js';
import codificaJWT from '../helpers/codificaJWT.js';
export default class AuthService {
    constructor(usuarioDAO, publicKey) {
        this.usuarioDAO = usuarioDAO;
        this.publicKey = publicKey;
    }

    async logaUsuario(email, senha) {
        validaLogin(email, senha);
        
        const usuario = await this.usuarioDAO.encontraUsuarioPorEmail(email);

        if(!usuario) throw new UsuarioNaoEncontrado();

        if(!await autenticaUsuario(usuario, senha)) throw new SenhaIncorreta();
        return {token: this.geraJWT(usuario.nome, usuario.email), publicKey: this.publicKey, nome: usuario.nome, email: usuario.email};
    }
    
    geraJWT(nome, email) {
        const payload = {nome, email}
        const jwt = codificaJWT(payload);
        return jwt;
    }
}