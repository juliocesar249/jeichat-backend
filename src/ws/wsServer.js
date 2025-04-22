import { WebSocketServer } from "ws";
import { chat } from "../controllers/chatController.js";

export default function iniciaWebSocket(servidorHttp) {
    const servidor = new WebSocketServer({server: servidorHttp});
    servidor.on('connection', (ws, req) => {
        if(req.url === '/chat') {
            chat(ws);
        } else {
            ws.send('rota não existe!');
            ws.close();
        }
    });
}