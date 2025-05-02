import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import ErroBase from '../errors/ErroBase.js';
import UsuarioLogado from '../errors/validacao/UsuarioLogado.js';

export default function usuarioLogado(req, res, next) {
    const publicKey = fs.readFileSync(path.resolve('./src', "keys", 'public.pem'), 'utf-8');
    const autorizacao = req.headers.authorization;
    if(!autorizacao) {
        next();
        return;
    };
    try {
        jwt.verify(autorizacao, publicKey, {algorithms: ['RS256']});
        throw new UsuarioLogado();
    } catch(err) {
        if(err.name === "TokenExpiredError") {
            console.log(err);
            next();
        } else if (err instanceof UsuarioLogado) {
            return next(err);
        } else {
            console.log(err)
            throw new ErroBase('Erro interno do servidor');
        }
    }
}