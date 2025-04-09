import ErroBase from "./ErroBase.js";
export default class DataInvalida extends ErroBase {
    constructor() {
        super('Data inválida! Formato aceito: MES/DIA/ANO', 400);
    }
}