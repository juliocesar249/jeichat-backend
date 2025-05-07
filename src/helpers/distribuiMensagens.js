export default async function distruiMensagens(conexao, mensagens) {
    for(const mensagem in mensagens) {
        await conexao.send(JSON.stringify(mensagem));
    }
}