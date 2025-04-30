import NomeVazio from '../../errors/validacao/NomeVazio.js';
export default function validaNome(nome) {
    if(!nome) throw new NomeVazio();
}