import mongoose from 'mongoose';
import FalhaAoSeConectar from '../errors/database/FalhaAoSeConectar.js';
import { DOCKER, MONGO_APP_USER, MONGO_APP_PASSWORD, MONGO_DB_NAME } from '../config/config.js'; 

const conexao = [];

try {
    conexao.push(await mongoose.connect(`mongodb://${DOCKER ? "mongodb:27017" : "localhost:27018"}`, {
        dbName: MONGO_DB_NAME,
        authSource: MONGO_DB_NAME,
        auth: {
            username: MONGO_APP_USER,
            password: MONGO_APP_PASSWORD
        }
    }));
} catch(e) {
    console.error(e);
    throw new FalhaAoSeConectar("MongoDB");
}

export default conexao[0];