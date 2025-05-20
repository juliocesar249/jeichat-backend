import jwt from 'jsonwebtoken';
import ErroBase from '../errors/ErroBase.js';
import UsuarioLogado from '../errors/validacao/UsuarioLogado.js';

export default function usuarioLogado(req, res, next) {
    console.log(req.cookies)
    const autorizacao = req.headers.authorization;
    if(!autorizacao) {
        next();
        return;
    };
    try {
        jwt.verify(autorizacao, process.env.CHAVE_JWT, {algorithms: ['HS256']});
        throw new UsuarioLogado();
    } catch(err) {
        if(err.name === "TokenExpiredError") {
            console.log(err);
            next();
        } else if (err instanceof UsuarioLogado) {
            return next(err);
        } else {
            console.log(err);
            throw new ErroBase('Erro interno do servidor');
        }
    }
}