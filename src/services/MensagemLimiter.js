import LimiteDeMensagensMinimoPermitido from '../errors/chat/LimiteDeMensagensMinimoPermitido.js';
export default class MensagemLimiter {
    #minimoPermitido = 5; // limite minimo de tokens dentro balde. literamente limite do limite.

    /*
        O contructo define o limite de tokens dentro
        do balde. E ESTADO_SPAM guarda os possiveis
        estados de SPAM do usuáiro, com e sem.
    */
    constructor(limite = 20) {
        if(limite > this.#minimoPermitido) {
            this.limite = limite;
        } else {
            throw new LimiteDeMensagensMinimoPermitido(this.#minimoPermitido);
        }
        this.usuarios = new Map();
        this.ESTADO_SPAM = {
            NORMAL: "NORMAL",
            SPAM: "SPAM"
        }
    }

    get minimoPermitido() {
        return this.#minimoPermitido;
    }

    /*
        Recebe o id do usuario e salva o
        estado padrão.
    */
    salvaUsuario(idUsuario) {
        this.usuarios.set(idUsuario, {
            tokens: this.limite,
            custoPorMensagem: 1,
            ultimaReposicao: Date.now(),
            pontosDeSpam: 0,
            modoSpam: this.ESTADO_SPAM.NORMAL
        });
    }

    /*
        verifica se o usuario tem tokens
        para enviar mensagens e retorna.
    */
    usuarioPodeMandar(idUsuario) {
        const usuario = {...this.usuarios.get(idUsuario)}; // evita bugs de referência.
        let permissao = undefined;
        let usuarioTemToken = undefined;
        
        this.#verificaLimite(usuario);
        usuarioTemToken = usuario.modoSpam === "SPAM" ? usuario.tokens > 1 : usuario.tokens > 0;
        if(usuarioTemToken) {
            usuario.tokens -= usuario.custoPorMensagem;
            permissao = true;
        } else {
            permissao = false;
        }

        this.usuarios.set(idUsuario, usuario);

        return permissao;
    }

    /*
        Verifica se há tokens para ser adicionado. É usado
        uma subtração do tempo da ultima vez que uma
        reposição foi feita e o tempo da verifcacao atual
        porque isso evita erros que podem acontecer com o
        uso do setTimeout, como por exemplo, atrasos, pela
        forma como o js lida com essas chamadas.
    */
    #verificaLimite(usuario) {
        const agora = Date.now();
        const tempoPassado = agora - usuario.ultimaReposicao;
        const tokensParaAdicionar = Math.floor(tempoPassado / 1000);

        if(tokensParaAdicionar > 0) this.#regeneraTokens(usuario, tokensParaAdicionar, agora);
        
        this.#atualizaSpam(usuario, tempoPassado);
    };


    #regeneraTokens(usuario, tokens, momentoVerificacao) {
        usuario.tokens = Math.min(this.limite, usuario.tokens + tokens);
        usuario.ultimaReposicao = momentoVerificacao;
    }

    /*
        Verifica-se se o intervalo de tempo que a mensagem
        atual foi enviada está dentro do intervalo seguro
        (a partir de 2 segundos). Caso não, um ponto de
        spam é adicionado e quando chegar a 3 pontos o 
        usuário entra em modo de spam e cada mensagem
        gasta 2 tokens. Para sair, é necessário que a
        pontuaçao 0 novamente (se chegar a 3 entra, mas
        se cair pra 2, ainda continua).
    */
    #atualizaSpam(usuario, tempoPassado) {
        const PONTOS_LIMITE = 3;
        const INTERVALO_SEGURO = 2000;

        if(tempoPassado < INTERVALO_SEGURO && usuario.pontosDeSpam < PONTOS_LIMITE) {
            usuario.pontosDeSpam += 1
        } else if(tempoPassado > INTERVALO_SEGURO && usuario.pontosDeSpam > 0) {
            usuario.pontosDeSpam -= 1;
        }

        if(usuario.pontosDeSpam === 3) {
            usuario.modoSpam = this.ESTADO_SPAM.SPAM;
        } else if(usuario.pontosDeSpam === 0) {
            usuario.modoSpam = this.ESTADO_SPAM.NORMAL;
        }

        usuario.custoPorMensagem = usuario.modoSpam === this.ESTADO_SPAM.SPAM ? 2 : 1;
    }

    /*
        Retira o usuário do mapa. Deve ser usado somente após
        a desconexão do usuário.
    */
    deletaUsuario(idUsuario) {
        this.usuarios.delete(idUsuario);
    }
}
