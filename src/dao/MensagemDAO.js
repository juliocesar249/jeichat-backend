export default class MensagemDAO {
    constructor(model) {
        this.db = model;
    }

    async buscaMensagens(email) {
        if(email) return await this.db.find({email: email});
        return await this.db.find();
    }

    async salvaMensagem(mensagem) {
        const novaMensagem = new this.db(mensagem);
        await novaMensagem.save();
    }
}