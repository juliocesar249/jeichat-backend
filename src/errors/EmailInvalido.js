import ErroBase from "./ErroBase.js";

export default class EmailInvalido extends ErroBase {
    constructor() {
        super('Email inválido!', 400);
    }
}