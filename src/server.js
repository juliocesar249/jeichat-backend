import fs from 'fs';
import path from 'path';
import cors from 'cors';
import http from 'http';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import iniciaWebSocket from './ws/wsServer.js';
import geraParDeChaves from './helpers/geraParDeChaves.js';

console.clear();

const app = express();
const servidor = http.createServer(app);
const PORT = process.env.PORT || 3000;

(function(){const caminhoChaves = path.resolve('src','keys');
const caminhoPrivateKey = path.join(caminhoChaves, 'private.pem');
const caminhoPublicKey = path.join(caminhoChaves, 'public.pem');
if(!fs.existsSync(caminhoPrivateKey) && !fs.existsSync(caminhoPublicKey)) {
    console.warn('Chaves não encontradas!');
    console.log('Gerando novas...');
    geraParDeChaves();
}})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('<h1>Servidor funcionando!</h1>'))
app.use('/api', userRoutes);
app.use(errorHandler);

iniciaWebSocket(servidor);

servidor.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`));