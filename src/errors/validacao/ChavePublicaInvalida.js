import ErroBase from '../ErroBase.js';
export default class ChavePublicaInvalida extends ErroBase {
    constructor() {
        super('Chave pública inválida!', 400);
    }
}