import ErroBase from "../errors/ErroBase.js";

export default function handleWsError(conexao, erro) {
    let respostaErro;

    if (erro instanceof ErroBase) {
        console.error(`${erro.message}`.red);
        respostaErro = {
            evento: 'erro',
            mensagem: erro.message,
            status: erro.status || 500
        };
    } else {
        console.error('Erro inesperado na conexão:', erro);
        respostaErro = {
            evento: 'erro',
            mensagem: 'Ocorreu um erro interno no servidor.',
            status: 500
        };
    }

    conexao.send(JSON.stringify(respostaErro));
}
