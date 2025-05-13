import {randomBytes} from 'crypto';
export default class ChaveService {
    /**
     * 
     * @param {number} horas Intervalo de tempo, `em horas`, para a gerar a próxima chave.
     * @param {number} tempoPermanencia Tempo, `em horas` que a chave atual ficará ativa.
     * @param {object} cache Objeto de acesso ao cache.
     */
    constructor(horas, tempoPermanencia, cacheDAO) {
        if(!horas || horas <= 0 || !tempoPermanencia || tempoPermanencia <= 0) {
            throw new Error('Intervalos inválidos');
        }
        this.INTERVALO_DE_ROTACAO = horas * 60 * 60 * 1000;
        this.CACHE_TTL = tempoPermanencia * 60 * 60;
        this.cache = cacheDAO;
    }

    static geraChaveSimetrica() {
        let chave = randomBytes(32);
        chave = chave.toString('hex');
        return chave;
    }

    async inicializarChaves() {
        console.log('Inicializando chaves de criptografia...'.yellow);
        const chave = ChaveService.geraChaveSimetrica();
        process.env.CHAVE_JWT = chave;
        await this.cache.salvaChave(chave, 'jwt');
        console.log("✓ Chave de criptgorafia JWT salva.".green);

        await this.rotacionaChave();
    }

    async rotacionaChave(tentativas = 0) {
        if(tentativas > 5) {
            console.log("✕ Falha ao gerar chave de criptografia das mensagens.".red);
            process.exit();
        }

        try {
            console.log('Rotacionando chave de criptografia das mensagens...'.yellow);
            const novaChave = ChaveService.geraChaveSimetrica();
            await this.cache.salvaChave(novaChave, "mensagem", this.CACHE_TTL);
            this.agendaProximaRotacao();
            console.log("✓ Rotaçao concluída.". green);
        } catch(err) {
            console.error("✕ Erro ao rotacionar chave:".red, err);
            console.log("Tentando novamente em 60 segundos...".yellow);
            setTimeout(async () => await this.rotacionaChave(tentativas + 1), 60000);
        }
    }

    agendaProximaRotacao() {
        const agora = Date.now();
        const proximaRotacao = agora + this.INTERVALO_DE_ROTACAO;
        const tempoDeEspera = proximaRotacao - agora;
        console.log(`Proxima rotação em ${this.INTERVALO_DE_ROTACAO / (60 * 60 * 1000)} horas.`.magenta);
        setTimeout(async () => await this.rotacionaChave(), tempoDeEspera);
    }

}