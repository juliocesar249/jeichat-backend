import validaData from "./data.js";
import validaNome from "./nome.js";
import validaEmail from "./email.js";
import validaSenha from "./senha.js";
export function validaCadastro(nome, email, senha, data) {
    validaNome(nome);
    validaEmail(email);
    validaSenha(senha);
    validaData(data);
}