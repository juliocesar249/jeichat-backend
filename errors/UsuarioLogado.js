import ErroBase from "./ErroBase.js";

export default class UsuarioLogado extends ErroBase {
    constructor() {
        super('Usuário já está logado', 409);
    }
}