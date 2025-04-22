import postgres from "pg";
const {Pool} = postgres;

const pool = new Pool({
    database: "jeichat_usuarios",
    port: 5433,
    host: 'localhost',
    user: "admin",
    password: "senhafortedeexemplo"
});

await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS Usuarios(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        dataNascimento DATE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL
    );
`);

export default pool;