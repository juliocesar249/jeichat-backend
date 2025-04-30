import ErroBase from "../ErroBase.js";
export default class DataInvalida extends ErroBase {
    constructor() {
        super('Data inválida! Formato aceito: DIA/MES/ANO', 400);
    }
}