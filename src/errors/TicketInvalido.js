import ErroBase from "./ErroBase.js";
export default class TicketInvalido extends ErroBase{
    constructor(){
        super('Ticket inválido!', 401);
    }
}