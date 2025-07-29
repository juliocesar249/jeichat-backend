import handleWsError from '../helpers/handleWsError.js';
import {v4 as uuidv4} from 'uuid';
import MensagemLimiter from './MensagemLimiter.js';
import distribuiMensagens from '../helpers/distribuiMensagens.js';
import conexaoProxyFactory from '../proxies/conexaoProxyFactory.js';
import extraiDadosMensagem from "../helpers/extraiDadosMensagem.js";
import LimiteDeMensagensAtingido from '../errors/chat/LimiteDeMensagensAtingido.js';
import UsuarioNaoEncontrado from "../errors/database/UsuarioNaoEncontrado.js";

export default class ChatService {
    #conexoes = new Map(); // privado para impedir que qualquer um tenha acesso a essas conexões.
    #limiteConexoes = 50;
    #limiter;
    #cacheDAO;
    #mensagemDAO;
    #usuarioDAO;
    #nonceService;

    constructor(usuarioDAO, mensagemDAO, cacheDAO, nonceService) {
        this.#usuarioDAO = usuarioDAO;
        this.#mensagemDAO = mensagemDAO;
        this.#cacheDAO = cacheDAO;
        this.#nonceService = nonceService;
        this.MAX_MENSAGEM_POR_SEGUNDOS = 20;
        this.#limiter = new MensagemLimiter(this.MAX_MENSAGEM_POR_SEGUNDOS); // privado para impedir que qualquer possa mecher no limite.
    }

    /*
        Esse método verifica se a quantidade
        permitida de conexões não foi atingida,
        e então ela fica salva.
    */
    salvaConexoes(conexao) {
        if(this.#conexoes.size === this.#limiteConexoes) throw new LimiteDeConexoesAtingido();
        this.#conexoes.set(conexao.uuid, conexao);
        this.#limiter.salvaUsuario(conexao.uuid);
    }

    /*
        Atributo definido como privado visando
        melhor segurança, já que conhecendo o id
        do usuário e a existência do método,
        pode-se facilmente deletar a conexão
        de um usário.
    */
    #deletaConexao(uuid) {
        this.#conexoes.delete(uuid);
        this.#limiter.deletaUsuario(uuid);
    }

    async configuraConexao(conexao) {
        Object.defineProperty(conexao, 'uuid', {
            value: uuidv4(),
            enumerable: true,
            writable: false,
            configurable: false
        });
        const conexaoProxy = conexaoProxyFactory(conexao);
        conexaoProxy.on('close', () => {
            this.#deletaConexao(conexaoProxy.uuid);
            console.log(`UUID ${conexaoProxy.uuid} desconectado`.red);
        });

        conexaoProxy.on('message', async stringDeDados => {
            try {
                // verifica se o usuário atingiu o limite de msgs/min e o alerta, caso verdadeiro
                if(!this.#limiter.usuarioPodeMandar(conexao.uuid)) {
                    throw new LimiteDeMensagensAtingido();
                }
                
                let objDeDados;
                try {
                     objDeDados = JSON.parse(stringDeDados);
                } catch(err) {
                    handleWsError(conexaoProxy, err);
                    return;
                }

                const usuarioUUID = (await this.#usuarioDAO.encontraUsuarioPorEmail(objDeDados.usuario.email))[0].id;
                if(!usuarioUUID) {
                    conexaoProxy.close();
                    throw new UsuarioNaoEncontrado();
                }

                await this.#nonceService.verificaEAdiciona(objDeDados.mensagem.nonce, usuarioUUID);
                await this.salvaMensagem(objDeDados);
                objDeDados = extraiDadosMensagem(objDeDados);
                this.#conexoes.forEach(conexaoProxy => {
                    conexaoProxy.send(JSON.stringify(objDeDados));
                });

            } catch (err) {
                handleWsError(conexaoProxy, err);
            }
        });

        this.salvaConexoes(conexaoProxy);
        conexaoProxy.send(JSON.stringify({evento: 'config', status: 'ready', message: 'Conexão estabelecida com texto UTF-8'}));
        await this.restauraHistorico(conexaoProxy);
    }

    async restauraHistorico(conexao) {
        const mensagensEmCahe = await this.#cacheDAO.recuperaHistorico();
        let mensagensDoBanco;
        if(Array.isArray(mensagensEmCahe) && mensagensEmCahe.length > 0) {    // verifica se tem alguma mensagem em cache
            await distribuiMensagens(conexao, mensagensEmCahe); // se tiver é distribuído
            return;
        } else {
            mensagensDoBanco = await this.#mensagemDAO.buscaMensagens();
            mensagensDoBanco = mensagensDoBanco.reverse().splice(0, 20).reverse(); // invertido para pegar as 20 últimas e inverte de novo para ficar na ordem cronologia correta.
            await distribuiMensagens(conexao, mensagensDoBanco);
            await Promise.all(mensagensDoBanco.map(m => this.#cacheDAO.salvaMensagem(m))); // salva essas mensansagens no cache também.
            return;
        }
    }

    async salvaMensagem(mensagem) {
        await this.#mensagemDAO.salvaMensagem(mensagem);
        await this.#cacheDAO.salvaMensagem(mensagem);
    }

}