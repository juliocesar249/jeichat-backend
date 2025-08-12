import ErroBase from '../errors/ErroBase.js';
export default class LimpezaService {
    #mensagemDAO;
    #cacheDAO;
    #tarefaDAO;
    #INTERVALO = 12 * 60 * 60 * 1000;
    constructor(mensagemDAO, cacheDAO, tarefaDAO) {
        this.#mensagemDAO = mensagemDAO;
        this.#cacheDAO = cacheDAO;
        this.#tarefaDAO = tarefaDAO;
    }

    async iniciar() {
        const existeLimpezaParaExecutar = (await this.#tarefaDAO.procuraPorTarefaNaoExecutada())[0];
        if(existeLimpezaParaExecutar) {
            console.log('✓ Tarefa de limpeza encontrada.'.magenta);
            let agora = Date.now();
            let diferenca = existeLimpezaParaExecutar.proxima_execucao.getTime() - agora;
            if(diferenca <= 0) {
                await this.executarLimpeza(existeLimpezaParaExecutar.id);
            } else if(diferenca < this.#INTERVALO) {
                console.log('↺ Iniciando agendamente de limepeza existente...'.yellow);
                await this.agendaProximaLimpeza(existeLimpezaParaExecutar.proxima_execucao, existeLimpezaParaExecutar.id);
            }
        } else {
            await this.agendaProximaLimpeza(Date.now() + this.#INTERVALO);
        }
    }

    async agendaProximaLimpeza(proximaExecucao, idLimpezaParaExecutar) {
        console.log('↺ Agendando próxima limpeza de mensagens...'.yellow);
        let idLimpeza;

        if(!idLimpezaParaExecutar) {
            await this.#tarefaDAO.criaNovaTarefa('LIMPEZA_MENSAGENS', proximaExecucao, 'AGENDADO');
            idLimpeza = (await this.#tarefaDAO.procuraPorProximaTarefaAgendada())[0].id;
        } else {
            idLimpeza = idLimpezaParaExecutar;
        }

        const tempoDeEspera = proximaExecucao - Date.now();
        setTimeout(async () => await this.executarLimpeza(idLimpeza), tempoDeEspera);

        console.log(`✓ Próxima limpeza de mensagens agendada para daqui a ${Math.round(tempoDeEspera / (60 * 60 * 1000))} horas.`.green);
    }

    async executarLimpeza(idLimpeza, tentativas = 0) {
        await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'EXECUTANDO');
        try {
            await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'EXECUTANDO');
            let inicio = Date.now();
            console.log('↺ Iniciando limpeza do histórico de mensagens no banco de dados...'.yellow);
            await this.#mensagemDAO.deletaMensagensAntigas(12);
            let fim = Date.now();
            console.log(`✓ Limpeza do histórico de mensagens do banco de dados completa. (${new Date(fim - inicio).getMilliseconds()}ms)`.green);
        } catch(err) {
            console.log(`✕ Erro ao executar limpeza ${idLimpeza}`);
            if(tentativas < 3) {
                console.log(`✕ Erro ao apagar histórico de mensagens do banco de dados (${tentativas + 1} tentativa):`.red);
                console.log(err);
                console.log(`↺ Reagendando tarefa ${tarefa.id} para daqui a 15 minutos.`.yellow);
                await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'AGENDADO');
                setTimeout(async () => this.executarLimpeza(idLimpeza, tentativas + 1), this.#INTERVALO)
            } else {
                console.error('✕ Falha ao executar limpeza, limite de tentativas atingido.'.red);
                await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'FALHOU');
                throw new ErroBase('Erro interno do servidor'.red);
            }
        }

        try {
            let inicio = Date.now();
            console.log('↺ Iniciando limpeza do histórico de mensagens no cache...'.yellow);
            await this.#cacheDAO.limpaHistoricoMensagens();
            let fim = Date.now();
            console.log(`✓ Limpeza do histórico de mensagens do cache completa. (${new Date(fim - inicio).getMilliseconds()}ms)`.green);
        } catch(err) {
            console.log(`✕ Erro ao executar limpeza ${idLimpeza}`);
            if (tentativas < 3) {
                console.log('✕ Erro ao apagar histórico de mensagens no cache:'.red);
                console.log(err);
                console.log(`↺ Reagendando tarefa ${tarefa.id} para daqui a 15 minutos.`.yellow);
                await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'AGENDADO');
                setTimeout(async () => this.executarLimpeza(idLimpeza, tentativas + 1), this.#INTERVALO)
            } else {
                console.error('✕ Falha ao executar limpeza, limite de tentativas atingido.'.red);
                await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'FALHOU');
                throw new ErroBase('Erro interno do servidor'.red);
            }

        }
        await this.agendaProximaLimpeza(Date.now() + this.#INTERVALO);
        await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'EXECUTADO');
    }
}