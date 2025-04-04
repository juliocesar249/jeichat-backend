import express from 'express';
import cors from 'cors';
const app = express();
import { config } from 'dotenv';

console.clear();

config();
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());
app.use(cors());

const usuarios = [];

// Mensagem de abertura
app.get('/', (req, res) => {
    res.send('<h1 style="font-family: monospace">SERVIDOR RODANDO</h1>')
});

// Lista de usuários
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
    return;
});

// Adicionar novos usuários
app.post('/usuarios/cadastrar', (req, res) => {
    try{
        const novoUsuario = req.body;

        for(let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].nome === novoUsuario.nome && usuarios[i].senha === novoUsuario.senha) {
                res.json({'codigo': 0, 'mensagem': 'Usuário já existe!'})
                return;
            }
        }

        usuarios.push(novoUsuario);
        res.json({'codigo': 1, 'mensagem': 'Usuário adicionado com sucesso!'});
        return;
    } catch (err) {
        res.send('Falha ao adicionar novo usuário:', err);
    }
    return;
});

// Logar usuario
app.post('/usuarios/login', (req, res) => {
    const dados = req.body;
    const nome = dados.nome;
    const senha = dados.senha;

    const usuario = usuarios.find(usuario => usuario.nome === nome);

    if(!usuario) {
        res.json({codigo: 0, mensagem: "Usuario não existe!"});
    } else if(usuario.senha !== senha) {
        res.json({codigo: 0, mensagem: "Senha incorreta!"});
    } else {
        res.json({codigo: 1, mensagem: "Logado com sucesso!"});
    }

    return;
});

app.listen(5000, () => console.log('Servidor aberto em http://localhost:5000'))