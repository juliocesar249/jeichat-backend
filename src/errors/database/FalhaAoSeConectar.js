import ErroBase from "../ErroBase.js";
export default class FalhaAoSeConectar extends ErroBase {
    constructor(nomeDoBanco) {
        super(`Falha do servidor ao tentar se conectar com ${nomeDoBanco}`, 503);
    }
}