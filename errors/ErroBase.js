export default class ErroBase extends Error {
    constructor(mensagem, status) {
        super(mensagem);
        this.status = status || 500;
    }
}