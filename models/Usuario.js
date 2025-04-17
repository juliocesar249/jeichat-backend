export default class Usuario {

    constructor(nome, email, senha, anoNascimento,) {
        this.nome = nome;
        this.anoNascimento = new Date(anoNascimento);
        this.email = email;
        this._senha = senha;
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