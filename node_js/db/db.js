import { Low } from 'lowdb';
import {JSONFile} from 'lowdb/node';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url+'\\..');
const __dirname = dirname(__filename)
const file = join(__dirname, 'usuarios.json');

const adapter = new JSONFile(file);
const db = new Low(adapter, {usuarios: []});

await db.write();

export default db;