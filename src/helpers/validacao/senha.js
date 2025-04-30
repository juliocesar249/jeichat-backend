import validator from 'validator';
import SenhaVazia from '../../errors/validacao/SenhaVazia.js';
import SenhaInvalida from '../../errors/validacao/SenhaInvalida.js';

export default function validaSenha(senha, fromLogin=false) {
    if (!senha) {
        throw new SenhaVazia()
    } else if(!fromLogin) {
        if(!validator.isStrongPassword(senha)) throw new SenhaInvalida();
    }
}