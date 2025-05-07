export default async function distruiMensagens(conexao, mensagens) {
    for(const mensagem of mensagens) {
        await conexao.send(JSON.stringify(mensagem));
    }
}