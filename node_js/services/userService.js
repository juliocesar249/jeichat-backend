import { validaCadastro } from "../helpers/validacao/index.js";
import Usuario from "../models/Usuario.js";
import { criaUsuario, getUsuarioPorEmail } from "../dao/usuarioDao.js";
import {geraHash} from '../helpers/hashHelper.js'

export async function adicionaUsuario(nome, data, email, senha) {
    validaCadastro(nome, email, senha, data);

    const existe = await getUsuarioPorEmail(email);
    console.log(existe)

    if (existe) throw new Error('Usuário já existe!');

    const senhaHash = await geraHash(senha);
    const novoUsuario = new Usuario(nome, email, senhaHash, data);
    
    await criaUsuario(novoUsuario.toJSON());
}