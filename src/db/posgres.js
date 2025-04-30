import postgres from "pg";
import { config } from "dotenv";
import FalhaAoSeConectar from "../errors/database/FalhaAoSeConectar.js";
config();

const {Pool} = postgres;

const pool = new Pool({
    database: "jeichat_usuarios",
    port: 5433,
    host: 'localhost',
    user: "app_user",
    password: process.env.POSTGRES_APP_PASSWORD
});

try {
    await pool.query('SELECT 1');
} catch(e) {
    console.log(e);
    throw new FalhaAoSeConectar();
}

export default pool;
