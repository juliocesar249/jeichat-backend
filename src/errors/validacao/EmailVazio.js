import ErroBase from "../ErroBase.js";

export default class EmailVazio extends ErroBase {
    constructor() {
        super('Email não pode ficar vazio!', 400)
    }
}