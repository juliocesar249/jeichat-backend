import { WebSocketServer } from "ws";
import { chat } from "../controllers/chatController.js";
import verificaTicket from "../helpers/verificaTicket.js";

export default function iniciaWebSocket(servidorHttp) {
    const servidor = new WebSocketServer({server: servidorHttp});
    servidor.on('connection', async (ws, req) => {
        const protocol = req.headers['sec-websocket-protocol'] || (req.connection.encrypted ? 'https' : 'http');
        const url = new URL(protocol + '://' + req.headers.host+ req.url);
        const ticket = 'ws-ticket:'+url.searchParams.get('ws-ticket');
        try {
            const dados = await verificaTicket(ticket, req.socket.remoteAddress)
            if(url.pathname === '/chat') {
                await chat(ws, req, dados);
            } else {
                ws.send('rota não existe!');
                ws.close();
            }
        } catch(err) {
            console.error(err);
            ws.send(JSON.stringify({evento: 'erro', mensagem: 'Ticket inválido.', status: 401}));
            ws.close();
        }
    });
}