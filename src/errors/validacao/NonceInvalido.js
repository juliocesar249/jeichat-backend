import ErroBase from '../ErroBase.js';
export default class NonceInvalido extends ErroBase {
    constructor() {
        super('Nonce já utilizado.', 401);
    }
}