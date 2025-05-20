import ErroBase from "./ErroBase.js";
export default class TokenInvalido extends ErroBase {
    constructor() {
        super('Token de autenticação inválido.', 401);  
    }
}