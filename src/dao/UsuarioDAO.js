import UsuarioNaoEncontrado from "../errors/database/UsuarioNaoEncontrado.js";
export default class UsuarioDAO {
    constructor(pool) {
        this.pool = pool;
    }

    async encontrarTodosUsuarios() {
        const usuarios = await this.pool.query('SELECT id, nome, email FROM usuarios');

        return usuarios.rows;
    }

    async encontraUsuarioPorEmail(email) {
        const valor = [email];
        const usuario = await this.pool.query("SELECT * FROM usuarios WHERE email = $1", valor);
        return usuario.rows;
    }

    async criaUsuario(usuario) {
        const values = [usuario.nome, usuario.data, usuario.email, usuario.senhaHash];
        const querry = `
            INSERT INTO Usuarios(nome, dataNascimento, email, senha_hash)
            VALUES ($1, $2, $3, $4);
        `
        this.pool.query(querry, values);
    }

    async editaUsuario(email, novosDados) {

        const usuario = (await this.encontraUsuarioPorEmail(email))[0];
        if(!usuario) throw new UsuarioNaoEncontrado();

        const camposPermitidos = ['nome', 'email', 'dataNascimento', 'senha_hash'];

        const atualizacao = {
            valores: [],
            campos: []
        };
        let indice = 0;
        for(const campo in novosDados) {
            if(camposPermitidos.includes(campo) && novosDados[campo] !== usuario[campo]) {
                atualizacao.valores.push(novosDados[campo]);
                atualizacao.campos.push(`${campo} = $${atualizacao.valores.length}`);
            }
            indice++;
        }
        atualizacao.valores.push(usuario.email);
        return await this.pool.query(`
            UPDATE Usuarios SET ${atualizacao.campos.join(', ')} WHERE email = $${atualizacao.valores.length}
            RETURNING nome, email;
        `, atualizacao.valores);
    }

    async deletarUsuario(email) {
        return await this.pool.query(`
            DELETE FROM Usuarios WHERE email = $1';    
        `, [email])
    }

    async salvaChavePublica(chave, email) {
        const idUsuario = (await this.encontraUsuarioPorEmail(email))[0].id;
        const query = `INSERT INTO chaves_publicas(chave, id_usuario) VALUES ($1, $2) ON CONFLICT (id_usuario) DO UPDATE SET chave = EXCLUDED.chave`;
        const values = [chave, idUsuario];
        await this.pool.query(query, values);
    }

    async procuraChavePublica(email) {
        const usuario = (await this.encontraUsuarioPorEmail(email))[0];
        if(!usuario) throw new UsuarioNaoEncontrado();
        const query = `SELECT chave FROM chaves_publicas WHERE id_usuario = $1`;
        const values = [usuario.id];
        const chave = await this.pool.query(query, values);
        return chave.rows;
    }

    async salvaNonce(nonce, usuarioId) {
        const query = `INSERT INTO nonces_usuario (nonce, id_usuario) VALUES ($1, $2)`;
        const values = [nonce, usuarioId];
        return await this.pool.query(query, values);
    }

    async nonceExiste(nonce, usuarioId = undefined) {
        const dadosQuery = {values: []};
        dadosQuery.values.push(nonce);
        if(usuarioId){
            dadosQuery.values.push(usuarioId);
            dadosQuery.query = `SELECT * FROM nonces_usuario WHERE nonce = $1 AND id_usuario = $2`;
        } else {
            dadosQuery.query = `SELECT * FROM nonces_usuarios WHERE nonce = $1`;
        }

        const res = await this.pool.query(dadosQuery.query, [...dadosQuery.values])

        return res.rows;
    }
}