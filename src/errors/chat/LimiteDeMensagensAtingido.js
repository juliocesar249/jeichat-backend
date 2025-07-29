import ErroBase from "../ErroBase.js";

class LimiteDeMensagensAtingido extends ErroBase {
    constructor(mensagem = "Muitas mensagens, aguarde...") {
        super(mensagem, 429);
    }
}

export default LimiteDeMensagensAtingido;
