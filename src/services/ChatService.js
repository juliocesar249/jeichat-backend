import LimiteDeConexoesAtingido from '../errors/chat/LimiteDeConexoesAtingido.js'
import {v4 as uuidv4} from 'uuid'
import MensagemLimiter from '../helpers/MensagemLimiter.js';
export default class ChatService {
    #conexoes = new Map(); // privado para impedir que qualquer um tenha acesso a essas conexões.
    #limiteConexoes = 50;
    #limiter;

    constructor(mensagemDAO) {
        this.mensagemDAO = mensagemDAO;
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

    configuraConexao(conexao) {
        conexao.uuid = uuidv4(); //! REMOVER DEPOIS SOMENTE PARA TESTES
        conexao.on('message', async mensagemJson => {
            // verifica se o usuário atingiu o limite de msgs/min e o alerta, caso verdadeiro
            if(!this.#limiter.usuarioPodeMandar(conexao.uuid)) {
                conexao.send(JSON.stringify({evento: "alerta", mensagem: "Tá com pressa paizão? Vai com calma"}));
                console.log(`conexao: ${conexao.uuid} atingiu limite de 20 mensagens. Aguardando o reset do limite...`);
                return;
            }
            
            let mensagem;
            try {
                mensagem = JSON.parse(mensagemJson);
            } catch(err) {
                conexao.send(JSON.stringify({evento: 'erro', mensagem: 'Mensagem mal formatada'}));
                return;
            }
            await this.salvaMensagem(mensagem);
            this.#conexoes.forEach(ws => {
                ws.send(JSON.stringify(mensagem));
            });
        });

        conexao.on('close', () => {
            this.#deletaConexao(conexao.uuid);
            console.log(`UUID ${conexao.uuid} desconectado`);
        })
        this.salvaConexoes(conexao);
        conexao.send(JSON.stringify({evento: 'config', status: 'ready', message: 'Conexão estabelecida com texto UTF-8'}));
        this.restauraHistorico(conexao);
    }

    async restauraHistorico(conexao) {
        (await this.mensagemDAO.buscaMensagens()).forEach(mensagem => {
            conexao.send(JSON.stringify(mensagem));
        });
    }

    async salvaMensagem(mensagem) {
        await this.mensagemDAO.salvaMensagem(mensagem);
    }
}