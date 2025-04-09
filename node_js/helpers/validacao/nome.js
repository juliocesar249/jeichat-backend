import erros from './erros.js';
export default function validaNome(nome) {
    if(!nome) throw new Error(erros.nomeVazio);
}