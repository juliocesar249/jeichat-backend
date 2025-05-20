import jwt from 'jsonwebtoken';
export default function verificaAssinaturaMensagem(mensagem) {
    return jwt.verify(mensagem, this.env.CHAVE_MENSAGEM, {algorithms: ['HS256']});
}