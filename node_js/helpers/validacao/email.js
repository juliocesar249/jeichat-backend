import validator from 'validator';
import erros from './erros.js';
export default function validaEmail(email) {
    if(!email) {
        throw new Error(erros.emailVazio);
    } else if(!validator.isEmail(email)) {
        throw new Error(erros.emailInvalido);
    }
}