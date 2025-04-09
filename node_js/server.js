import express from 'express';
import cors from 'cors';
const app = express();
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';

console.clear();

config();
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

app.listen(PORT, () => console.log(`Servidor aberto em http://localhost:${PORT}`));