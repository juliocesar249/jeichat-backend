export default class CacheDAO {
    constructor(conexao) {
        this.redis = conexao;
        this.cache = {
            temMensagens: 0
        };
    }

    async salvaEmail(email) {
        const chave = 'autenticacao:emails';
        const resposta =  await this.redis.lPush(chave, email);
        await this.redis.lTrim(chave, 0, 99);
        const ttl = await this.redis.ttl(chave);
        if(ttl === -1) await this.redis.expire(chave, 1800);
        return resposta;
    }

    async encontraEmail(email) {
        const chave = 'autenticacao:emails'
        const emails = await this.redis.lRange(chave, 0, -1);
        return emails.find(emailGuardado => emailGuardado === email);
    }

    async salvaMensagem(mensagem) {
        const chave = 'chat:global:mensagens';
        const resposta = await this.redis.rPush(chave, JSON.stringify(mensagem));
        await this.redis.lTrim(chave, -20, -1);
        const ttl = await this.redis.ttl(chave);
        if (ttl === -1) await this.redis.expire(chave, 1800);
        return resposta;
    }

    async recuperaHistorico() {
        const chave = 'chat:global:mensagens';
        const mensagens = (await this.redis.lRange(chave, 0, -1))?.map(mensagem => JSON.parse(mensagem));
        if(mensagens) this.cache.temMensagens = 1;
        return mensagens;
    }
}