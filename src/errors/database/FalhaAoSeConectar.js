import ErroBase from "../ErroBase.js";
export default class FalhaAoSeConectar extends ErroBase {
    constructor() {
        super('Falha do servidor ao tentar se conectar com o banco de dados.', 503)
    }
}