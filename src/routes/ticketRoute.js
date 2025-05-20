import {Router} from 'express';
import {v4 as uuidv4} from 'uuid';
import verificaToken from "../middlewares/verificaToken.js";
import {usuarioService} from "../config/dependencias.js";

const ticketRoute = Router();

ticketRoute.get('/ws-ticket', async (req, res) => {
    try {
        const wsTicket = uuidv4();
        const token = verificaToken(req.cookies.auth_token);
        const data = {
            email: token.email,
            ip: req.ip,
            timeStamp: Date.now() + 5000
        }
        await usuarioService.salvaTicket('ws-ticket:'+wsTicket, data);
        res.json({wsTicket});
    } catch(err) {
        console.error(err);
        res.send({codigo: 0, erro: 'Falha ao gerar ticket: ' + err.message});
    }
});

export default ticketRoute;