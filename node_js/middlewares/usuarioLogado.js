import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import UsuarioLogado from '../errors/UsuarioLogado.js';
import ErroBase from '../errors/ErroBase.js';
export default function usuarioLogado(req, res, next) {
    const publicKey = fs.readFileSync(path.join(path.resolve('keys'), 'public.pem'), 'utf-8');
    const autorizacao = req.headers.authorization;
    if(!autorizacao) return next();
    try {
        jwt.verify(autorizacao, publicKey, {algorithms: ['RS256']});
        throw new UsuarioLogado();
    } catch(err) {
        console.log('-----------------------------------------------')
        console.log()
        console.log()
        console.log()
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