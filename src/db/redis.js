import { createClient } from "redis";
import { REDIS_PASSWORD } from "../config/config.js";

const cliente = createClient({
    url: 'redis://localhost:6379',
    username: 'default',
    password: REDIS_PASSWORD,
    socket: {
        /*
            Ao tentar se reconectar, o redis chama essa função
            que deve retornar o tempo em ms para cada tentativa
            de reconexão. O delay diz em quanto tempo deve ser feita
            a próxima tentativa e ao somar a flutuação (0-200ms) com ele
            evita que vários usuários tentem se reconectar ao mesmo tempo
            causam instabilidade, nesse caso, a variação é entre 0 e 200
            milisegundos.
        */
        reconnectStrategy: tentativas => {
            const jitter = Math.random() * 1000;

            const delay = Math.min(Math.pow(2, tentativas) * 50);

            return delay + jitter;
        }
    }
});

cliente.on('ready', () => {
    console.log('✅ Conexão estabelecida com o Redis'.green);
});

cliente.on('error', err => {
    console.log('Erro no redis:'.red, err); 
    console.log('Reconectando..'.yellow);
});

export default cliente;