import ErroBase from "../ErroBase.js";
export default class UsuarioNaoEncontrado extends ErroBase {
    constructor() {
        super('Usuário não encontrado!', 404);
    }
}