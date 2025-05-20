import ErroBase from "./ErroBase.js";
export default class PropriedadeNaoExiste extends ErroBase {
    constructor(prop) {
        super(`Propriedade ou método ${prop} não existe.`, 500);
    }
}