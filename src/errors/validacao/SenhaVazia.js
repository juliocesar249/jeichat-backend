import ErroBase from "../ErroBase.js";
export default class SenhaVazia extends ErroBase {
    constructor() {
        super('Senha não pode ficar vazia!', 400);
    }
}