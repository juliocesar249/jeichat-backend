import {geraHash} from '../helpers/hashHelper.js';
import formataData from "../helpers/formataData.js";
import UsuarioExiste from "../errors/validacao/UsuarioExiste.js";
import { validaCadastro } from "../helpers/validacao/index.js";

export default class CadastroService {
    constructor(usuarioDAO, cacheDAO) {
        this.usuarioDAO = usuarioDAO;
        this.cacheDAO = cacheDAO;
    }

    async cadastraUsuario(nome, data, email, senha) {
        validaCadastro(nome, email, senha, data);

        const emailEmCache = await this.cacheDAO.encontraEmail(email);
        let usuarioNoBanco;
        if(!emailEmCache) {
            usuarioNoBanco = (await this.usuarioDAO.encontraUsuarioPorEmail(email))?.[0];
        }

        if(emailEmCache || usuarioNoBanco) {
            if(!emailEmCache) await this.cacheDAO.salvaEmail(usuarioNoBanco.email);
            throw new UsuarioExiste();
        };

        const senhaHash = await geraHash(senha);
        const novoUsuario = {nome, data: formataData(data), email, senhaHash};

        await this.usuarioDAO.criaUsuario(novoUsuario);
        if(!emailEmCache) await this.cacheDAO.salvaEmail(novoUsuario.email);
    }
}