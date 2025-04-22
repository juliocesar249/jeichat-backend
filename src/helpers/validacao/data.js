import validator from 'validator';
import DataVazia from '../../errors/DataVazia.js';
import DataInvalida from '../../errors/DataInvalida.js';

export default function validaData(data) {
    if(!data) {
        throw new DataVazia();
    } else if(!validator.isDate(data, {format: 'DD/MM/YYYY', strictMode: true}) || new Date(data) > new Date()) {
        throw new DataInvalida();
    }
}