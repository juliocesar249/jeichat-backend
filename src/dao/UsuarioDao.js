import UsuarioNaoEncontrado from "../errors/database/UsuarioNaoEncontrado.js";
export default class UsuarioDAO {
    constructor(pool) {
        this.pool = pool;
    }

    async encontrarTodosUsuarios() {
        const usuarios = await this.pool.query('SELECT * FROM usuarios');

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

    /**
     * 
     * @param {string} email 
     * @param {object} novosDados 
     * @returns nome e email do usuário alterado.
     */
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
}