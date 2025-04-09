import validator from 'validator';
import SenhaVazia from '../../errors/SenhaVazia.js';
import SenhaInvalida from '../../errors/SenhaInvalida.js';

export default function validaSenha(senha, fromLogin=false) {
    if (!senha) {
        throw new SenhaVazia()
    } else if(!fromLogin) {
        if(!validator.isStrongPassword(senha)) throw new SenhaInvalida();
    }
}