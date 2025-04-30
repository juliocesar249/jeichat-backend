import ErroBase from "../ErroBase.js";
export default class UsuarioExiste extends ErroBase {
    constructor() {
        super('Usuário já existe no sistema!', 409);
    }
}