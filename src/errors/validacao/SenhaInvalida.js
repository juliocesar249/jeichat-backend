import ErroBase from '../ErroBase.js';
export default class SenhaInvalida extends ErroBase {
    constructor() {
        super('A senha deve conter no minímo 8 caracteres (maiúsculos e minúsculos), 1 simbolo e 1 numero.');
    }
}