import validator from 'validator';
import erros from './erros.js';

export default function validaSenha(senha, fromLogin=false) {
    if (!senha) {
        throw new Error(erros.senhaVazia);
    } else if(!fromLogin) {
        if(!validator.isStrongPassword(senha)) throw new Error(erros.senhaInvalida);
    }
}