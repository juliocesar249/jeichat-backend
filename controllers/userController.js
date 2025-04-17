import { cadastroService, authService } from '../config/dependencias.js';

async function usuarios(req, res) {
    
    res.json(await cadastroService.usuarioDAO.encontrarTodosUsuarios());
    return;
}

async function cadastro(req, res) {

    const dados = req.body;
    const { nome, data, email, senha } = dados;

    await cadastroService.cadastraUsuario(nome, data, email, senha);
    
    res.json({'codigo': 1, 'mensagem': 'Usuário adicionado com sucesso!'});
    return;
}

async function login(req, res) {

    const {email, senha} = req.body;
    
    const autenticacao = await authService.logaUsuario(email, senha);

    res.json({mensagem: "Logado com sucesso!", token: autenticacao.token, nome: autenticacao.nome, email: autenticacao.email});
    return;
}

export {usuarios, cadastro, login};