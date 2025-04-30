import ErroBase from "../ErroBase.js";
export default class LimiteDeMensagensMinimoPermitido extends ErroBase {
    constructor(limite) {
        super("Limite minímo de mensagens é de " + limite, 500);
    }
}