import express from 'express';
import cors from 'cors';
const app = express();
import { config } from 'dotenv';
import Usuario from './Usuario.js';
import validator from 'validator';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

console.clear();

config();
const SECRET_KEY = process.env.SECRET_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const file = join(__dirname, 'usuarios.json');

app.use(express.json());
app.use(cors());
const adapter = new JSONFile(file);
const db = new Low(adapter, {usuarios: []});

// Mensagem de abertura
app.get('/', (req, res) => {
    res.send('<h1 style="font-family: monospace">SERVIDOR RODANDO</h1>')
});

// Lista de usuários
app.get('/usuarios', async (req, res) => {
    await db.read();
    res.json(db.data.usuarios);
    return;
});

// Adiciona novos usuários
app.post('/usuarios/cadastrar', async (req, res) => {
    try{
        await db.read();
        const dados = req.body;
        const { nome, data, email, senha } = dados;

        if(!nome || !data || !email || !senha) {
            res.json({'codigo': 0, 'mensagem': 'Preencha todos os campos!'});
            return;
        } else if(!validator.isEmail(email)) {
            res.json({'codigo': 0, 'mensagem': 'Email inválido!'});
            return;
        } else if(db.data.usuarios.some(usuario => usuario.email === email)) {
            res.json({'codigo': 0, 'mensagem': 'Este email já está registrado!'});
            return;
        } else if(isNaN(new Date(data)) || new Date(data) > new Date()) {
            res.json({'codigo': 0, 'mensagem':'Data inválida! Formato aceito: (mes/dia/ano)'});
            return;
        }

        const novoUsuario = new Usuario(nome, email, data);
        await novoUsuario.definirSenha(senha)

        await db.data.usuarios.push(novoUsuario.toJSON());
        await db.write();
        
        res.json({'codigo': 1, 'mensagem': 'Usuário adicionado com sucesso!'});
    } catch (err) {
        res.json({'codigo': 0, 'mensagem': err.message});
        console.log('Falha ao adicionar usuário!');
        throw new Error(err);
    }
});

// Loga o usuario
app.post('/usuarios/login', async (req, res) => {
    await db.read();
    const dados = req.body;
    const { email, senha } = dados;

    if(!email || !senha) {
        res.json({'codigo': 0, 'mensagem': 'Preencha todos os campos!'});
        return;
    } else if(!validator.isEmail(email)) {
        res.json({'codigo': 0, 'mensagem': 'Email inválido!'});
        return;
    }

    const dadosBrutos = db.data.usuarios.find(usuario => usuario.email === email);
    const usuario = Usuario.fromJSON(dadosBrutos);

    if(!usuario) {
        res.json({codigo: 0, mensagem: "Usuario não existe!"});
    } else if(!await usuario.autenticaUsuario(senha)) {
        res.json({codigo: 0, mensagem: "Senha incorreta!"});
    } else {
        res.json({codigo: 1, mensagem: "Logado com sucesso!"});
    }

    return;
});

app.listen(5000, () => console.log('Servidor aberto em http://localhost:5000'));