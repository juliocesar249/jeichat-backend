export default function extraiDadosMensagem(mensagemOriginal) {
    const {usuario, mensagem} = mensagemOriginal;
    const {dados, iv} = mensagem;
    return {usuario, mensagem: {dados, iv}};
}