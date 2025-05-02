import postgres from "pg";
import FalhaAoSeConectar from "../errors/database/FalhaAoSeConectar.js";
import { DOCKER, POSTGRES_APP_USER, POSTGRES_APP_PASSWORD, POSTGRES_DB_NAME } from "../config/config.js";

const {Pool} = postgres;

const pool = new Pool({
    database: POSTGRES_DB_NAME,
    port: DOCKER ? 5432:5433,
    host: DOCKER ? 'postgres':'localhost',
    user: POSTGRES_APP_USER,
    password: POSTGRES_APP_PASSWORD
});

try {
    await pool.query('SELECT 1');
} catch(e) {
    console.log(e);
    throw new FalhaAoSeConectar("PostgreSQL");
}

export default pool;
