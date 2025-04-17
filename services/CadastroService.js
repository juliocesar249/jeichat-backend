import { validaCadastro } from "../helpers/validacao/index.js";
import Usuario from "../models/Usuario.js";
import {geraHash} from '../helpers/hashHelper.js';
import UsuarioExiste from "../errors/UsuarioExiste.js";

export default class CadastroService {
    constructor(usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    async cadastraUsuario(nome, data, email, senha) {
        validaCadastro(nome, email, senha, data);

        const existe = await this.usuarioDAO.encontraUsuarioPorEmail(email);

        if(existe) throw new UsuarioExiste();

        const senhaHash = await geraHash(senha);
        const novoUsuario = new Usuario(nome, email, senhaHash, data);

        await this.usuarioDAO.criaUsuario(novoUsuario.toJSON());
    }
}