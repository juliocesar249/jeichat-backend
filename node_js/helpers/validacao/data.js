import validator from 'validator';
import erros from './erros.js';

 export default function validaData(data) {
    if(!data) {
        throw new Error(erros.dataVazia);
    } else if(!validator.isDate(data, {format: 'MM/DD/YYYY', strictMode: true}) || new Date(data) > new Date()) {
        throw new Error(erros.dataInvalida);
    }
}