
import mongoose from 'mongoose';
import { DOCKER, MONGO_APP_USER, MONGO_APP_PASSWORD, MONGO_DB_NAME } from '../config/config.js'; 

mongoose.connection.on('disconnected', () => {
    console.log('✕ Conexão com o MongoDB perdida.'.red);
    console.log('Tentando se reconectar ao MongoDB...'.yellow);
});

mongoose.connection.on('reconnected', () => {
    console.log('✓ Conexão reestabelecida com MongoDB.'.green);
});

try {
    mongoose.connect(`mongodb://${DOCKER ? "mongodb:27017" : "localhost:27018"}`, {
        dbName: MONGO_DB_NAME,
        authSource: MONGO_DB_NAME,
        auth: {
            username: MONGO_APP_USER,
            password: MONGO_APP_PASSWORD
        },
        retryWrites: true,
        retryReads: true
    }).then(() => console.log('✓ Conexão estabelecida com o MongoDB.'.green));
} catch(e) {
    console.error('Erro no mongo:'.red, e.message);
    throw new FalhaAoSeConectar("MongoDB");
}


export default mongoose;