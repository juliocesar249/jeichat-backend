import { validaLogin } from '../helpers/validacao/login.js';
import autenticaUsuario from '../helpers/autenticaUsuario.js';
import {getUsuarioPorEmail} from '../dao/usuarioDao.js';

export default async function logaUsuario(email, senha) {
    validaLogin(email, senha);

    const usuario = await getUsuarioPorEmail(email);
    console.log(usuario)
    
    if(!usuario) {
        throw new Error("Usuario não existe!");
    }

    if(!autenticaUsuario(usuario, senha)) throw new Error('Senha incorreta!');
}