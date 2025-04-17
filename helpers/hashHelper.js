import bcrypt from 'bcrypt';

const saltRounds = 10;

async function geraHash(senha) {
    return await bcrypt.hash(senha, saltRounds);
}

async function comparaHash(senha, hash) {
    return await bcrypt.compare(senha, hash);
}

export {geraHash, comparaHash};