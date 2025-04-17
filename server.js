import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import fs from 'fs';
import geraParDeChaves from './helpers/geraParDeChaves.js';
import path from 'path';

const app = express();
console.clear();

const caminhoChaves = path.resolve('keys');
const caminhoPrivateKey = path.join(caminhoChaves, 'private.pem');
const caminhoPublicKey = path.join(caminhoChaves, 'public.pem');
if(!fs.existsSync(caminhoPrivateKey) && !fs.existsSync(caminhoPublicKey)) {
    console.warn('Chaves não encontradas!');
    console.log('Gerando novas...');
    geraParDeChaves();
}

config();
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`));