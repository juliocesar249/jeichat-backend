export default async function distribuiMensagens(conexao, mensagens) {
    for(const mensagem of mensagens) {
        await conexao.send(JSON.stringify(mensagem));
    }
}