export default class ChatService {
    #conexoes = [];

    constructor() {
        this.mensagemDAO = [];
    }

    salvaConexoes(conexao) {
        this.#conexoes.push(conexao);
    }

    configuraConexao(conexao) {
        conexao.send(JSON.stringify({evento: 'config', status: 'ready', message: 'Conexão estabelecida com texto UTF-8'}));
        conexao.on('message', mensagemJson => {
            const mensagem = JSON.parse(mensagemJson);
            this.salvaMensagens(mensagem);
            this.#conexoes.forEach(ws => {
                ws.send(JSON.stringify(mensagem));
            });
        });
        this.salvaConexoes(conexao);
        this.restauraHistorico(conexao);
    }

    restauraHistorico(conexao) {
        this.mensagemDAO.forEach(mensagem => {
            conexao.send(JSON.stringify(mensagem));
        })
    }

    salvaMensagens(mensagem) {
        this.mensagemDAO.push(mensagem);
        console.log(this.mensagemDAO);
    }
}