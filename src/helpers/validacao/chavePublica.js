import crypto from 'crypto';
import ChavePublicaInvalida from '../../errors/validacao/ChavePublicaInvalida.js';
export default function validaChavePublica(chave) {
    try {
        crypto.createPublicKey({key: chave, format: 'pem', type: 'spki'})
    } catch (e) {
        console.error(e);
        throw new ChavePublicaInvalida();
    }
}