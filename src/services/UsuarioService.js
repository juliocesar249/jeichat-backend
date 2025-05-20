import {validaCadastro, validaLogin} from "../helpers/validacao/index.js";
import UsuarioExiste from "../errors/validacao/UsuarioExiste.js";
import {geraHash} from "../helpers/hashHelper.js";
import formataData from "../helpers/formataData.js";
import UsuarioNaoEncontrado from "../errors/database/UsuarioNaoEncontrado.js";
import autenticaUsuario from "../helpers/autenticaUsuario.js";
import SenhaIncorreta from "../errors/validacao/SenhaIncorreta.js";
import codificaJWT from "../helpers/codificaJWT.js";

export default class UsuarioService {
    #usuarioDAO;
    #cacheDAO
    constructor(usuarioDAO, cacheDAO) {
        this.#usuarioDAO = usuarioDAO;
        this.#cacheDAO = cacheDAO;
    }

    async cadastraUsuario(nome, data, email, senha) {
        validaCadastro(nome, email, senha, data);

        const emailEmCache = await this.#cacheDAO.encontraEmail(email);
        let usuarioNoBanco;
        if(!emailEmCache) {
            usuarioNoBanco = (await this.#usuarioDAO.encontraUsuarioPorEmail(email))?.[0];
        }

        if(emailEmCache || usuarioNoBanco) {
            if(!emailEmCache) await this.#cacheDAO.salvaEmail(usuarioNoBanco.email);
            throw new UsuarioExiste();
        }

        const senhaHash = await geraHash(senha);
        const novoUsuario = {nome, data: formataData(data), email, senhaHash};

        await this.#usuarioDAO.criaUsuario(novoUsuario);
        if(!emailEmCache) await this.#cacheDAO.salvaEmail(novoUsuario.email);
    }

    async logaUsuario(email, senha) {
        validaLogin(email, senha);

        const usuario = (await this.#usuarioDAO.encontraUsuarioPorEmail(email))[0];

        if(!usuario) throw new UsuarioNaoEncontrado();

        if(!await autenticaUsuario(usuario, senha)) throw new SenhaIncorreta();
        return {token: UsuarioService.geraJWT(usuario.nome, usuario.email), nome: usuario.nome, email: usuario.email};
    }

    static geraJWT(nome, email) {
        const payload = {nome, email};
        return codificaJWT(payload);
    }

    async salvaChavePublica(chave, email) {
        await this.#usuarioDAO.salvaChavePublica(chave, email);
    }

    async procuraChavePublica(email) {
        return await this.#usuarioDAO.procuraChavePublica(email);
    }

    async salvaTicket(ticket, conteudo) {
        await this.#cacheDAO.salvaTicket(ticket, conteudo)
    }

    async procuraTicket(ticket) {
        return await this.#cacheDAO.procuraTicket(ticket);
    }
}