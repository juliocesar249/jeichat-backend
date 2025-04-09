import logaUsuario from '../services/authService.js';
import { adicionaUsuario } from '../services/userService.js';
import { getTodosUsuarios } from '../dao/usuarioDao.js';

async function usuarios(req, res) {

    res.json(await getTodosUsuarios());
    return;
}

async function cadastro(req, res) {
    try{
            const dados = req.body;
            const { nome, data, email, senha } = dados;
    
            await adicionaUsuario(nome, data, email, senha);
            
            res.json({'codigo': 1, 'mensagem': 'Usuário adicionado com sucesso!'});
        } catch (err) {
            res.json({'codigo': 0, 'mensagem': err.message});
            console.log('Falha ao adicionar usuário!');
            throw new Error(err);
        }
}

async function login(req, res) {
    try {
        const {email, senha} = req.body;
        
        await logaUsuario(email, senha);

        res.json({codigo: 1, mensagem: "Logado com sucesso!"});
        return;
    } catch(err) {
        res.json({'codigo': 0, 'mensagem': err.message});
        console.log('Falha ao logar usuário!');
        throw new Error(err);
    }
}

export {usuarios, cadastro, login};