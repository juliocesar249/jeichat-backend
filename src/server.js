import cors from 'cors';
import http from 'http';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import iniciaWebSocket from './ws/wsServer.js';

const app = express();
const servidor = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('<h1>Servidor funcionando!</h1>'))
app.use('/api', userRoutes);
app.use(errorHandler);

iniciaWebSocket(servidor);

servidor.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`.cyan));