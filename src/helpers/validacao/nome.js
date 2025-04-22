import NomeVazio from '../../errors/NomeVazio.js';
export default function validaNome(nome) {
    if(!nome) throw new NomeVazio();
}