import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

console.clear();

const server_url = 'http://localhost:5000/usuarios';
const app = express();
app.use(express.json());
app.use(cors());

//  Mensagem de abertura
app.get('/', (req, res) => {
    res.send('<h1 style="font-family: monospace">API RODANDO</h1>');
    return;
});

// Adicionar usuário
app.post('/cadastro', async (req, res) => {
    const dados = req.body;
    try {    
        const fetchResponse = await fetch(`${server_url}/cadastrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        const resposta = await fetchResponse.json();
        res.json(resposta);
    } catch(err) {
        console.log(`Erro ao se comunicar com o servidor: ${err}`);
        res.json({"codigo": 0, "mensagem": "Erro ao se comunicar com o servidor!"});
    }
    return;
});

// Logar usuário
app.post('/logar', async (req, res) => {
    const dados = req.body;

    try {
        const fetchResponse = await fetch(`${server_url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });
        const resposta = await fetchResponse.json();
        res.json(resposta);
    } catch (err) {
        console.log(`Erro ao se comunicar com o servidor: ${err}`);
        res.json({"codigo": 0, "mensagem": "Erro ao se comunicar com o servidor!"});
    }
    return;
})

app.listen(3000, () => console.log('API aberta em http://localhost:3000'))