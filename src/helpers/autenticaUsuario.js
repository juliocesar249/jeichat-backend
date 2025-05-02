import bcrypt from 'bcrypt';

export default async function autenticaUsuario(usuario, senha) {
    return await bcrypt.compare(senha, usuario.senha_hash);
}