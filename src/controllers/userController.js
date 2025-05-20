import { usuarioService } from '../config/dependencias.js';

async function usuarios(req, res) {
    // res.json(await );
    return;
}

async function cadastro(req, res) {

    const dados = req.body;
    const { nome, data, email, senha } = dados;

    await usuarioService.cadastraUsuario(nome, data, email, senha);
    
    res.json({'codigo': 1, 'mensagem': 'Usuário adicionado com sucesso!'});
    return;
}

async function login(req, res) {

    const {email, senha} = req.body;

    const autenticacao = await usuarioService.logaUsuario(email, senha);

    res.cookie('auth_token', autenticacao.token, {
        maxAge: 3600000,
        httpOnly: true, 
        secure: true,
        sameSite: 'none'
    });
    res.json({'codigo': 1, 'mensagem': 'Logado com sucesso!', email: autenticacao.email});
    return;
}

export {usuarios, cadastro, login};