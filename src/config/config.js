import { config } from "dotenv";

if(!process.env.DOCKER) {
    config();
    console.log("✓ Variáveis de ambiente locais carregadas.".green)
}

export const {
    DOCKER,
    POSTGRES_DB_NAME,
    POSTGRES_APP_USER,
    POSTGRES_APP_PASSWORD,
    MONGO_DB_NAME,
    MONGO_APP_USER,
    MONGO_APP_PASSWORD,
    REDIS_PASSWORD,
} = process.env;