import postgres from "pg";
import FalhaAoSeConectar from "../errors/database/FalhaAoSeConectar.js";
import { DOCKER, POSTGRES_APP_USER, POSTGRES_APP_PASSWORD, POSTGRES_DB_NAME } from "../config/config.js";

const {Pool} = postgres;
let pool = undefined;

const poolConfig = {
    user: POSTGRES_APP_USER,
    password: POSTGRES_APP_PASSWORD,
    host: DOCKER ? 'postgres':'localhost',
    port: DOCKER ? 5432:5433,
    database: POSTGRES_DB_NAME,
};

const MAX_TENTATIVAS = 5;
const DELAY_RECONEXAO = 5000;

async function conexaoComTentativas(tentativa = 1) {
    if(tentativa > MAX_TENTATIVAS) {
        throw new FalhaAoSeConectar('PostgresSQL (máx. tentativas atingido.)'.red);
    }

    pool = new Pool(poolConfig);

    try {
        const cliente = await pool.connect();
        await cliente.query('SELECT 1');
        cliente.release();
        console.log('✅ Conexão com PostgreSQL estabelecida!'.green);
        return pool;
    } catch (err) {
        console.error(`❌ Tentativa ${tentativa} de conexão ao PostgreSQL falhou.`.red);
        console.log(err);
        console.error(`Tentando conecatar ao PostgreSQL novamente em ${DELAY_RECONEXAO / 1000}s...`.yellow);
        await new Promise(resolve => setTimeout(resolve, DELAY_RECONEXAO));
        return conexaoComTentativas(tentativa + 1);
    }
}

pool?.on('error', err => {
    console.log('Erro no pool do PostgresSQL durante a execução:'.red, err.message);
});

const poolAtivo = await conexaoComTentativas().catch(err => {
    console.error(err.message);
    process.exit();
})

export default poolAtivo;
