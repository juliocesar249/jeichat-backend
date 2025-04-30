export default function criaModel(mongoose) {
    const mensagemSchema = new mongoose.Schema({
        usuario: {
            nome: {type: String, required: true},
            email: {type: String, required: true}
        },
        texto: {type: String, required: true}
    }, {
        timestamps: true,
        collection: 'mensagens'
    })
    
    mensagemSchema.index({createdAt: -1});
    
    
    return mongoose.model('mensagem', mensagemSchema);
}