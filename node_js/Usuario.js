import validator from "validator";
import bcrypt from 'bcrypt';
export default class Usuario {

    constructor(nome, email, anoNascimento,) {
        this.nome = nome;
        this.anoNascimento = new Date(anoNascimento);
        this.email = email;
        this._senha = '';
    }

    static fromJSON({nome, email, data, _senha}) {
        const usuario = new Usuario(nome, email, data);
        usuario._senha = _senha;
        return usuario;
    }

    async definirSenha(senha){
        Usuario.validaSenha(senha);
        const salt = await bcrypt.genSalt(10);
        this._senha = await bcrypt.hash(senha, salt);
    }

    static validaSenha(senha) {
        if (!validator.isStrongPassword(senha)) {
            throw new Error('A senha deve conter no minímo 8 caracteres (maiúsculos e minúsculos), 1 simbolo e 1 numero');
        }

        return senha;
    }

    async autenticaUsuario(senha) {
        return bcrypt.compare(senha, this._senha);
    }

    toJSON() {
        return {
            nome: this.nome,
            email: this.email,
            data: this.anoNascimento,
            _senha: this._senha
        };
    }
}