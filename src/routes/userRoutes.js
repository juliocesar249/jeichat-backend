import {Router} from 'express';
import usuarioLogado from '../middlewares/usuarioLogado.js';
import {usuarios, cadastro, login} from '../controllers/userController.js';

const router = Router();

// Lista de usuários
router.get('/usuarios', usuarios);

// Cadastra usuário
router.post('/usuarios/cadastrar', cadastro);

// Loga usuário
router.post('/usuarios/login', login);

export default router;