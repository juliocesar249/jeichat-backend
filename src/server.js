import cors from 'cors';
import http from 'http';
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import ticketRoute from "./routes/ticketRoute.js";
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import iniciaWebSocket from './ws/wsServer.js';

const app = express();
const servidor = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [/* frontend address aqui */],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.send('<h1>Servidor funcionando!</h1>'));
app.use(ticketRoute);
app.use('/api', userRoutes);
app.use(errorHandler);

iniciaWebSocket(servidor);

servidor.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`.cyan));