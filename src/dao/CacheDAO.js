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

    /**
     * 
     * @param {string} chave chave criptográfica
     * @param {"jwt" | "mensagem"} tipo 
     * @param {number} ttl Tempo de duração da chave em `segundos`
     */
    async salvaChave(chaveCripto, tipo, ttl = 60) {
        const chave = `criptografia:chaves:${tipo}`;
        const valor = `{"${tipo}": "${chaveCripto}"}`;
        const resposta = await this.redis.set(chave, valor);
        if(tipo === "mensagem") {
            await this.redis.lPush(`${chave}:historico`, chaveCripto);
            await this.redis.expire(chave, ttl);
        }

        return resposta;
    }

    /**
     * 
     * @param {"jwt" | "mensagem"} tipo 
     */
    async procuraChaveCriptografica(tipo) {
        const chave = `criptografia:chaves:${tipo}`;
        return await this.redis.get(chave);
    }
}