export default function criaModel(mongoose) {
    const mensagemSchema = new mongoose.Schema({
        usuario: {
            nome: {type: String, required: true},
            email: {type: String, required: true}
        },
        mensagem: {
            dados: {type: String, required: true},
            iv: {type: String, required: true},
            authTag: {type: String, required: true}
        },
        assinatura: {type: String, required: true},
        chavePublicaDeAssinatura: {type: String, required: true}
    }, {
        timestamp: true,
        collection: 'mensagens'
    })
    
    mensagemSchema.index({createdAt: -1});
    
    
    return mongoose.model('mensagem', mensagemSchema);
}