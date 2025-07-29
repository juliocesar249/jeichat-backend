import NonceInvalido from "../errors/validacao/NonceInvalido.js";
import ErroBase from "../errors/ErroBase.js";
export default class NonceService {
    #usuarioDAO;
    #cacheDAO;
    constructor(usuarioDAO, cacheDAO) {
        this.#usuarioDAO = usuarioDAO;
        this.#cacheDAO = cacheDAO;
    }

    async verificaEAdiciona(nonce, usuarioId) {
        const nonceExisteEmCache = await this.#cacheDAO.nonceExiste(nonce, usuarioId);
        if(nonceExisteEmCache) {
            throw new NonceInvalido();
        } else {
            const nonceExisteNoBanco = await this.#usuarioDAO.nonceExiste(nonce, usuarioId)
            if(nonceExisteNoBanco[0]) throw new NonceInvalido();
        }
        try {
            console.log('↺ Nonce sendo salvo...'.yellow);
            await this.#usuarioDAO.salvaNonce(nonce, usuarioId);
            await this.#cacheDAO.salvaNonce(nonce, usuarioId);
            console.log('✓ Nonce salvo com sucesso!'.green);
        } catch (err) {
            console.error(`✕ Erro ao salvar nonce: ${err}`.red);
            throw new ErroBase('Erro interno do servidor');
        }
    }
}