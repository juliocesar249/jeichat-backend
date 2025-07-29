import ErroBase from "../ErroBase.js";
export default class AssinaturaInvalida extends ErroBase {
    constructor() {
        super('Erro na verificação da assinatura, pode ter sido adulterada'.red, 401);
    }
};