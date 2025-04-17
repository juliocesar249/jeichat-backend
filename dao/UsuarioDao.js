import UsuarioNaoEncontrado from "../errors/UsuarioNaoEncontrado.js";
export default class UsuarioDAO {
    constructor(db) {
        this.db = db;
    }

    async encontrarTodosUsuarios() {
        await this.db.read();

        return this.db.data.usuarios;
    }

    async encontraUsuarioPorEmail(email) {
        await this.db.read();

        return this.db.data.usuarios.find(u => u.email === email);
    }

    async criaUsuario(usuario) {
        await this.db.read();

        this.db.data.usuarios.push(usuario);

        await this.db.write();
    }

    async editaUsuario(email, novosDados) {
        await this.db.read();

        const usuario = await this.encontraUsuarioPorEmail(email);
        if(!usuario) throw new UsuarioNaoEncontrado();

        for(const dado in novosDados) {
            usuario[dado] = novosDados[dado];
        }

        await this.db.write();
    }

    async deletarUsuario(email) {
        await this.db.read();

        const existe = db.data.usuarios.find(u => u.email === email);
        if(!exite) throw new UsuarioNaoEncontrado();

        this.db.data.usuarios = this.db.data.usuarios.filter(u => u.email !== email);

        await this.db.write();
    }
}