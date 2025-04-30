import {geraHash} from '../helpers/hashHelper.js';
import formataData from "../helpers/formataData.js";
import UsuarioExiste from "../errors/validacao/UsuarioExiste.js";
import { validaCadastro } from "../helpers/validacao/index.js";

export default class CadastroService {
    constructor(usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    async cadastraUsuario(nome, data, email, senha) {
        validaCadastro(nome, email, senha, data);

        const existe = await this.usuarioDAO.encontraUsuarioPorEmail(email)[0];

        if(existe) throw new UsuarioExiste();

        const senhaHash = await geraHash(senha);
        const novoUsuario = {nome, data: formataData(data), email, senhaHash};

        await this.usuarioDAO.criaUsuario(novoUsuario);
    }
}