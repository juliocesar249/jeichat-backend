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
        const existeLimpezaParaExecutar = (await this.#tarefaDAO.procuraPorProximaTarefaAgendada())[0];
        if(existeLimpezaParaExecutar) {
            console.log('✓ Tarefa de limpeza encontrada.'.magenta);
            let agora = Date.now();
            let diferenca = existeLimpezaParaExecutar?.proxima_execucao.getTime() - agora;

            if(existeLimpezaParaExecutar && diferenca <= 0) {
                await this.executarLimpeza(existeLimpezaParaExecutar.id);
            } else if(existeLimpezaParaExecutar && diferenca < this.#INTERVALO) {
                await this.agendaProximaLimpeza(diferenca, existeLimpezaParaExecutar);
            } else {
                console.log('↺ Iniciando agendamente de limepeza existente...'.yellow);
                await this.agendaProximaLimpeza(this.#INTERVALO);
            }
        } else {
            await this.agendaProximaLimpeza(this.#INTERVALO);
        }
    }

    async agendaProximaLimpeza(tempo, existeLimpezaParaExecutar) {
        console.log('↺ Agendando próxima limpeza de mensagen...'.yellow);
        let idLimpeza;

        if(!existeLimpezaParaExecutar) {
            await this.#tarefaDAO.criaNovaTarefa('LIMPEZA_MENSAGENS', Date.now() + tempo, 'AGENDADO');
            idLimpeza = (await this.#tarefaDAO.procuraPorProximaTarefaAgendada())[0].id;
        } else {
            idLimpeza = existeLimpezaParaExecutar;
        }

        setTimeout(async () => await this.executarLimpeza(idLimpeza), tempo);

        console.log(`✓ Próxima limpeza de mensagens agendada para daqui a ${Math.round(tempo / (60 * 60 * 1000))} horas`.green);
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

            await this.agendaProximaLimpeza(new Date().getTime() + this.#INTERVALO);

        }
        await this.#tarefaDAO.atualizaStatusTarefa(idLimpeza, 'EXECUTADO');
    }
}