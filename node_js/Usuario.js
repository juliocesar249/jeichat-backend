import validator from "validator";
export default class Usuario {
    #senha;

    constructor(nome, email, senha, anoNascimento) {
        this.nome = nome;
        this.anoNascimento = new Date(anoNascimento);
        this.email = email;
        this.senha = senha;
    }

    set senha(senha){
        Usuario.validaSenha(senha);
        this.#senha = senha;
    }

    static validaSenha(senha) {
        if (!validator.isStrongPassword(senha)) {
            throw new Error('A senha deve conter no minímo 8 caracteres (maiúsculos e minúsculos), 1 simbolo e 1 numero');
        }

        return senha;
    }

    autenticaUsuario(senha) {
        return this.#senha === senha;
    }
}