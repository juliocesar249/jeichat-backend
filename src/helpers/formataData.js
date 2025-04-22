export default function formataData(data) {
    const valores = data.split(/[\\\/-]/g);
    const dataFormatada = `${valores[1]}-${valores[0]}-${valores[2]}`;
    return dataFormatada;
}