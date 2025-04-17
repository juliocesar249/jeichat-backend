import validator from 'validator';
import EmailVazio from '../../errors/EmailVazio.js';
import EmailInvalido from '../../errors/EmailInvalido.js'
export default function validaEmail(email) {
    if(!email) {
        throw new EmailVazio();
    } else if(!validator.isEmail(email)) {
        throw new EmailInvalido();
    }
}