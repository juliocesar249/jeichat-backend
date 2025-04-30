import fs from 'fs';
import jwt from 'jsonwebtoken';
export default function codificaJWT(payload) {
    const privateKey = fs.readFileSync('./keys/private.pem', 'utf-8');
    const token = jwt.sign(payload, privateKey, {algorithm: 'RS256', expiresIn: '1h'});
    return token;
}