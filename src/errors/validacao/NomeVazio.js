import ErroBase from "../ErroBase.js";
export default class NomeVazio extends ErroBase {
    constructor() {
        super('Nome não pode ficar vazio!', 400);
    }
}