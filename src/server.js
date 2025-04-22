import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import fs from 'fs';
import geraParDeChaves from './helpers/geraParDeChaves.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import http from 'http';
import iniciaWebSocket from './ws/wsServer.js';

console.clear()

const app = express();
const servidor = http.createServer(app);
const PORT = 3000;

(function(){const caminhoChaves = path.resolve('src','keys');
const caminhoPrivateKey = path.join(caminhoChaves, 'private.pem');
const caminhoPublicKey = path.join(caminhoChaves, 'public.pem');
if(!fs.existsSync(caminhoPrivateKey) && !fs.existsSync(caminhoPublicKey)) {
    console.warn('Chaves não encontradas!');
    console.log('Gerando novas...');
    geraParDeChaves();
}})();
config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => res.send('<h1>Servidor funcionando!</h1>'))
app.use('/api', userRoutes);
app.use(errorHandler);

iniciaWebSocket(servidor);

servidor.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`));