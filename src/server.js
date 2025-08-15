import cors from 'cors';
import http from 'http';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import ticketRoute from "./routes/ticketRoute.js";
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import {chaveService} from "./config/dependencias.js";
import iniciaWebSocket from './ws/wsServer.js';
import {limpezaService} from "./config/dependencias.js";

const app = express();
const servidor = http.createServer(app);
const PORT = process.env.CONTAINER_PORT  || 3000;

app.use(cors({
    origin: ['http://127.0.0.1:4000', 'http://localhost:4000'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
await chaveService.iniciar();

app.get('/', (req, res) => res.send('<h1>Servidor funcionando!</h1>'));
app.use(ticketRoute);
app.use('/api', userRoutes);
app.use(errorHandler);

iniciaWebSocket(servidor);
await limpezaService.iniciar();

servidor.listen(process.env.PORT || 3000, () => console.log(`Servidor aberto em http://localhost:${PORT}`.cyan));