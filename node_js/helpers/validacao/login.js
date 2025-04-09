import validaEmail from "./email.js";
import validaSenha from "./senha.js";

export function validaLogin(email, senha) {
    validaEmail(email);
    validaSenha(senha, true);
}