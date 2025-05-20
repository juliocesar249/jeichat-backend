import jwt from 'jsonwebtoken';
import TokenInvalido from '../errors/TokenInvalido.js'
export default function verificaToken(token) {
    try {
        return jwt.verify(token, process.env.CHAVE_JWT, {algorithms: ['HS256']});
    } catch(e) {
        console.error('⚠️ Assinatura inválida!'.red);
        console.error(e);
        throw new TokenInvalido();
    }
}