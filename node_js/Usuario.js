import validator from "validator";
import bcrypt from 'bcrypt';
export default class Usuario {
    #senha;

    constructor(nome, email, anoNascimento) {
        this.nome = nome;
        this.anoNascimento = new Date(anoNascimento);
        this.email = email;
    }

    async definirSenha(senha){
        Usuario.validaSenha(senha);
        const salt = await bcrypt.genSalt(10);
        this.#senha = await bcrypt.hash(senha, salt);
    }

    static validaSenha(senha) {
        if (!validator.isStrongPassword(senha)) {
            throw new Error('A senha deve conter no minímo 8 caracteres (maiúsculos e minúsculos), 1 simbolo e 1 numero');
        }

        return senha;
    }

    async autenticaUsuario(senha) {
        return await bcrypt.compare(senha, this.#senha);
    }
}