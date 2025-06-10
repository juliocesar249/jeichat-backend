import PropriedadeNaoExiste from '../errors/PropriedadeNaoExiste.js';
import verificaAssinaturaMensagem from '../helpers/verificaAssinaturaMensagem.js'
export default function conexaoProxyFactory(conexao, mensagem) {
    return new Proxy(conexao, {
        user: {
            id: undefined,
            nonces: [],
        },
        get(alvo, prop, interceptador) {
            if(!(prop in alvo)) {
                console.log(`Propriedade ou método ${prop} não existe.`.red);
                throw new PropriedadeNaoExiste(prop);
            }

            try {
                const res = verificaAssinaturaMensagem(mensagem);
                interceptador.user.nonces.push(res.nonce);
            } catch(err) {
                console.error('⚠️ Assinatura da mensagem inválida.'.red, err);
                conexao.send(JSON.stringify({evento: 'alerta', mensagem: 'Criptografia da mensagem comprometida. Faça login novamente.'}));
            }
        }
    })
}