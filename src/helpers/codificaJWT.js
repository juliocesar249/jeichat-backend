import jwt from 'jsonwebtoken';
export default function codificaJWT(payload) {
    const token = jwt.sign(payload, process.env.CHAVE_JWT, {algorithm: 'HS256', expiresIn: '1h'});
    return token;
}