import ErroBase from './ErroBase.js';
export default class DataVazia extends ErroBase {
    constructor() {
        super('Data não pode ficar vazia!', 400);
    }
}