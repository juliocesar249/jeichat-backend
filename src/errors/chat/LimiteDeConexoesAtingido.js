import ErroBase from "../ErroBase.js";
export default class LimiteDeConexoesAtingido extends ErroBase {
    constructor() {
        super('Limite de conexões no chat atingido! Aguarde alguém se deconectar...', 503);
    }
}