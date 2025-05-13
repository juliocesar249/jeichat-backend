import jwt from 'jsonwebtoken';
export default function verificaToken(req, res, next) {
    const autorizacao = req.headers.authorization;
    if(jwt.verify(autorizacao, process.env.CHAVE_JWT, {algorithms: ['HS256']})) {
        res.json({mensagem: 'Usuário já está logado!'});
        return;
    } else {
        next();
    };
}