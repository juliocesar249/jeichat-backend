import handleWsError from "../helpers/handleWsError.js";
import PropriedadeNaoExiste from '../errors/PropriedadeNaoExiste.js';
import verificaAssinaturaMensagem from '../helpers/verificaAssinaturaMensagem.js';
import verificaIntegridadeMensagem from "../helpers/verificaIntegridadeMensagem.js";
import {usuarioService} from "../config/dependencias.js";

export default function conexaoProxyFactory(conexao) {
    return new Proxy(conexao, {
        get(alvo, prop, receptor) {
            if (prop === "on") {
                return function interceptaMensagem(tipo, funcaoOriginal) {
                    if (tipo === 'message') {
                        const funcaoComVerificacao = async (mensagemString) => {
                            try {
                                const mensagemObj = JSON.parse(mensagemString);

                                const { mensagem, assinatura, chavePublicaDeAssinatura } = mensagemObj;

                                if (!mensagem.dados || !assinatura || !mensagem.authTag) {
                                    return funcaoOriginal(mensagemString);
                                }

                                verificaAssinaturaMensagem(mensagem, assinatura, chavePublicaDeAssinatura);
                                verificaIntegridadeMensagem(mensagem.dados, mensagem.authTag, process.env.CHAVE_MENSAGENS);

                                funcaoOriginal(mensagemString);
                            } catch (err) {
                                handleWsError(alvo, err);
                            }
                        };

                        alvo.on(tipo, funcaoComVerificacao);
                    } else {
                        alvo.on(tipo, funcaoOriginal);
                    }
                }
            }

            if (!(prop in alvo)) {
                console.error(`✕ Propriedade ou método ${prop} não existe.`.red);
                throw new PropriedadeNaoExiste(prop);
            }
            return Reflect.get(alvo, prop, receptor);
        }
    });
}