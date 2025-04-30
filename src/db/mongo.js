import mongoose from 'mongoose';
import { config } from 'dotenv';
import FalhaAoSeConectar from '../errors/database/FalhaAoSeConectar.js';
config();

const conexao = [];

try {
    conexao.push(await mongoose.connect(process.env.MONGO_URI));
} catch(e) {
    throw new FalhaAoSeConectar();
}

export default conexao[0];