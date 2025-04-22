import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import fs from 'fs';
import geraParDeChaves from './helpers/geraParDeChaves.js';
import path from 'path';
import cookieParser from 'cookie-parser';

console.clear()

const app = express();
    
const caminhoChaves = path.resolve('src','keys');
const caminhoPrivateKey = path.join(caminhoChaves, 'private.pem');
const caminhoPublicKey = path.join(caminhoChaves, 'public.pem');
if(!fs.existsSync(caminhoPrivateKey) && !fs.existsSync(caminhoPublicKey)) {
    console.warn('Chaves não encontradas!');
    console.log('Gerando novas...');
    geraParDeChaves();
}

config();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser);
app.use('/api', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`));