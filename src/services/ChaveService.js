import {randomBytes, publicEncrypt, constants} from 'crypto';
export default class ChaveService {
    #cache;
    /**
     *
     * @param {number} horas Intervalo de tempo, `em horas`, para a gerar a próxima chave.
     * @param {number} tempoPermanencia Tempo, `em horas` que a chave atual ficará ativa.
     * @param {object} cacheDAO Objeto de acesso ao cache.
     */
    constructor(horas, tempoPermanencia, cacheDAO) {
        if(!horas || horas <= 0 || !tempoPermanencia || tempoPermanencia <= 0) {
            throw new Error('✕ Intervalos inválidos'.red);
        }
        this.INTERVALO_DE_ROTACAO = horas * 60 * 60 * 1000;
        this.CACHE_TTL = tempoPermanencia * 60 * 60;
        this.#cache = cacheDAO;
    }

    static geraChaveSimetrica() {
        let chave = randomBytes(32);
        chave = chave.toString('base64');
        return chave;
    }

    async iniciar() {
        console.log('↺ Inicializando chaves de criptografia...'.yellow);
        let existeChave = {jwt: {cache: (await this.#cache.procuraChaveCriptografica('jwt'))}, mensagens: {cache: (await this.#cache.procuraChaveCriptografica('mensagem'))}};
        if(!existeChave.jwt.cache && !existeChave.mensagens.cache) {
            await this.preparaChaveJWT();
            await this.rotacionaChave();
        } if(!existeChave.jwt.cache && existeChave.mensagens.cache) {
            await this.preparaChaveJWT();
        } else if(existeChave.jwt.cache && !existeChave.mensagens.cache) {
            await this.rotacionaChave();
        } else {
            process.env.CHAVE_JWT = existeChave.jwt.cache;
            process.env.CHAVE_MENSAGENS = existeChave.mensagens.cache;
            await this.agendaProximaRotacao(await this.#cache.tempoDeVida('chaveMensagens'));
        }
    }

    async prepararChaves() {
        const chave = ChaveService.geraChaveSimetrica();
        process.env.CHAVE_JWT = chave;
        await this.#cache.salvaChave(chave, 'jwt');
        console.log("✓ Chave de criptgorafia JWT salva.".green);

        await this.rotacionaChave();
    }

    async preparaChaveJWT() {
        try {
            console.log('↺ Criando chave de criptografia JWT...'.yellow);
            const chave = ChaveService.geraChaveSimetrica();
            process.env.CHAVE_JWT = chave;
            await this.#cache.salvaChave(chave, 'jwt');
            console.log('✓ Chave de criptografia JWT salva.'.green);
        } catch(err) {
            console.log('✕ Erro ao criar chave de criptografia JWT.'.red);
            console.log(err);
            throw new Error('Erro interno do servidor'.red);
        }
    }

    async rotacionaChave(tentativas = 0, proximaRotacao = 0) {
        if(tentativas > 5) {
            console.log("✕ Falha ao gerar chave de criptografia das mensagens.".red);
            process.exit();
        }

        try {
            console.log('↺ Rotacionando chave de criptografia de mensagens...'.yellow);
            const novaChave = ChaveService.geraChaveSimetrica();
            await this.#cache.salvaChave(novaChave, "mensagem", this.CACHE_TTL);
            process.env.CHAVE_MENSAGENS = novaChave;
            this.agendaProximaRotacao(proximaRotacao);
            console.log("✓ Rotaçao de chave de criptografia de mensagens concluída.". green);
        } catch(err) {
            console.error("✕ Erro ao rotacionar chave de criptografia de mensagens:".red, err);
            console.log("↺ Rotação de chave de criptografia novamente em 60 segundos...".yellow);
            setTimeout(async () => await this.rotacionaChave(tentativas + 1), 60000);
        }
    }

    agendaProximaRotacao(proximaRotacaoAgendada = 0) {
        const agora = Date.now();
        let proximaRotacao;

        if(proximaRotacaoAgendada > 0) {
            setTimeout(async () => await this.rotacionaChave(), proximaRotacaoAgendada);
            console.log(`Proxima rotação de criptografia de chaves em ${Math.round(proximaRotacaoAgendada / (60 * 60))} horas.`.magenta);
        } else {
            proximaRotacao = agora + this.INTERVALO_DE_ROTACAO;
            const tempoDeEspera = proximaRotacao - agora;
            console.log(`Proxima rotação de criptografia de chaves em em ${this.INTERVALO_DE_ROTACAO / (60 * 60 * 1000)} horas.`.magenta);
            setTimeout(async () => await this.rotacionaChave(), tempoDeEspera);
        }
    }

    criptografaChave(chavePublica) {
        return publicEncrypt({
            key: chavePublica,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        }, Buffer.from(process.env.CHAVE_MENSAGENS, 'base64'));
    }
}