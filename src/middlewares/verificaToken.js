import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
export default function verificaToken(req, res, next) {
    const publicKey = fs.readFileSync(path.join(path.resolve('keys'), 'public.pem'), 'utf-8');
    const autorizacao = req.headers.authorization;
    console.log(jwt.verify(autorizacao, publicKey, {algorithms: ['RS256']}))
    if(jwt.verify(autorizacao, publicKey, {algorithms: ['RS256']})) {
        res.json({mensagem: 'Usuário já está logado!'});
        return;
    } else {
        next();
    };
}