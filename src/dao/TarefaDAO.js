export default class TarefaDAO {
    #tarefas = ['LIMPEZA_MENSAGENS'];
    #status = ['AGENDADO', 'EXECUTANDO', 'EXECUTADO'];
    constructor(pool) {
        this.pool = pool;
    }

    async criaNovaTarefa(tarefa, proximaExecucao, status) {
        if(this.#tarefas.includes(tarefa)) {
            proximaExecucao = proximaExecucao / 1000; // Postgres trabalha com segundos não milisegundos
            const query = 'INSERT INTO tarefas_agendadas (nome_tarefa, proxima_execucao, status) VALUES ($1, to_timestamp($2), $3)';
            const values = [tarefa, proximaExecucao, status];
            return await this.pool.query(query, values);
        }
    }

    async procuraPorProximaTarefaAgendada(timestamp = Date.now()) {
        timestamp = timestamp / 1000;
        const query = 'SELECT * FROM tarefas_agendadas WHERE proxima_execucao >= to_timestamp($1)';
        const value = [timestamp];
        const tarefa = await this.pool.query(query, value);
        return tarefa.rows;
    }

    async procuraPorTarefaNaoExecutada() {
        const query = "SELECT * FROM tarefas_agendadas WHERE status = 'AGENDADO'";
        const tarefa = await this.pool.query(query);
        return tarefa.rows;
    }

    async buscaPorTarefaEmExecucao() {
        const query = 'SELECT * FROM tarefas_agendadas WHERE status = "EXECUTANDO"';
        const tarefa = await this.pool.query(query);
        return tarefa.rows;
    }

    async atualizaStatusTarefa(id, novoStatus) {
        const query = 'UPDATE tarefas_agendadas SET status = $2 WHERE id = $1';
        if(this.#status.includes(novoStatus)) {
            const values = [id, novoStatus];
            return await this.pool.query(query, values);
        }
    }
}