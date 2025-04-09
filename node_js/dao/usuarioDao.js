import {Low} from 'lowdb';
import {JSONFile} from 'lowdb/node';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url+'\\..');
const __dirname = dirname(__filename);
const file = join(__dirname, 'usuarios.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, {usuarios: []});

function buscaUsuarioLocal(email) {
    return db.data.usuarios.find(u => u.email === email);
}

export async function getTodosUsuarios() {
    await db.read();
    return db.data.usuarios;
}

export async function getUsuarioPorEmail(email) {
    await db.read();
    return db.data.usuarios.find(u => u.email === email);
}

export async function criaUsuario(usuario) {
    await db.read();
    db.data.usuarios.push(usuario);
    await db.write();
}

export async function editarUsuario(email, novosDados) {
    await db.read();
    const usuario = await getUsuarioPorEmail(email);
    for (const dado in novosDados) {
        usuario[dado] = novosDados[dado];
    }
    await db.write();

}

export async function deletarUsuario(email) {
    await db.read();
    const existe = await buscaUsuarioLocal(email);

    if(!existe) throw new Error('Usuário não encontrado!');

    db.data.usuarios = db.data.usuarios.filter(el => el.email !== email);
    await db.write()
}