import ErroBase from './ErroBase.js';
export default class SenhaIncorreta extends ErroBase {
    constructor() {
        super('Senha incorreta!', 400);
    }
}