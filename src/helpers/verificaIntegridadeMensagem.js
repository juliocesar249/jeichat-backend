import crypto from 'crypto';
import ErroBase from '../errors/ErroBase.js';

/**
 * Verifica a integridade de uma mensagem usando HMAC-SHA256.
 * Compara a authTag recebida do cliente com uma authTag calculada no servidor.
 * @param {string} dadosCriptografados - Os dados da mensagem, em base64.
 * @param {string} authTagRecebida - A authTag (HMAC) enviada pelo cliente, em base64.
 * @param {string} chaveSimetrica - A chave simétrica secreta, em base64.
 */
export default function verificaIntegridadeMensagem(dadosCriptografados, authTagRecebida, chaveSimetrica) {
    const hmac = crypto.createHmac('sha256', Buffer.from(chaveSimetrica, 'base64'));
    hmac.update(Buffer.from(dadosCriptografados, 'base64'));

    const authTagCalculada = hmac.digest();
    const authTagBuffer = Buffer.from(authTagRecebida, 'base64');

    if (authTagCalculada.length !== authTagBuffer.length) {
        throw new ErroBase('Falha na verificação de integridade: auth tag com tamanho inválido.', 500, 4001);
    }
    const integridadeValida = crypto.timingSafeEqual(authTagCalculada, authTagBuffer);

    if (!integridadeValida) {
        throw new ErroBase('Falha na verificação de integridade: a mensagem pode ter sido adulterada.', 500, 4002);
    }
}
