import fs from 'fs';
import {generateKeyPairSync} from 'crypto';

function geraParDeChaves() {
    const {privateKey, publicKey} = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    fs.mkdirSync('./src/keys');
    fs.writeFileSync('./src/keys/private.pem', privateKey);
    fs.writeFileSync('./src/keys/public.pem', publicKey);
}

export default geraParDeChaves;