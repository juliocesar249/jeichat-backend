import {generateKeyPairSync} from 'crypto';
import fs from 'fs';

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
    
    fs.writeFileSync('./keys/private.pem', privateKey);
    fs.writeFileSync('./keys/public.pem', publicKey);
}

export default geraParDeChaves;