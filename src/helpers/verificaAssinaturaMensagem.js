import crypto from 'crypto';
import AssinaturaInvalida from '../errors/validacao/AssinaturaInvalida.js';

export default function verificaAssinaturaMensagem({dados, iv, nonce}, assinatura, chaveAssinatura) {
    const verificador = crypto.createVerify('RSA-SHA256');
    const paraVerificar = JSON.stringify({dados, iv, nonce});
    chaveAssinatura = `-----BEGIN PUBLIC KEY-----\n${chaveAssinatura}\n-----END PUBLIC KEY-----`;
    // O conteúdo da mensagem precisa ser um Buffer para a verificação
    verificador.update(Buffer.from(paraVerificar, "utf8"));

    const assinaturaEhValida = verificador.verify(
        {
            key: Buffer.from(chaveAssinatura),
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        },
        assinatura,
        'base64'
    );

    if (!assinaturaEhValida) {
        throw new AssinaturaInvalida();
    }
}
