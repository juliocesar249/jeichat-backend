import TicketInvalido from "../errors/TicketInvalido.js";
import {usuarioService} from "../config/dependencias.js";

export default async function verificaTicket(ticket, ip) {
    const wsTicket = JSON.parse(await usuarioService.procuraTicket(ticket));
    if(!wsTicket || wsTicket.timestamp < Date.now() || ip !== wsTicket.ip) {
        throw new TicketInvalido();
    }
    return wsTicket;
}