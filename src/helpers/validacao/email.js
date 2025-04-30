import validator from 'validator';
import EmailVazio from '../../errors/validacao/EmailVazio.js';
import EmailInvalido from '../../errors/validacao/EmailInvalido.js'
export default function validaEmail(email) {
    if(!email) {
        throw new EmailVazio();
    } else if(!validator.isEmail(email)) {
        throw new EmailInvalido();
    }
}