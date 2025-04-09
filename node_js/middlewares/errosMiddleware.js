export default function errorMiddleware(err, req, res, next) {
    res.status(400).json({
        codigo: 0,
        mensagem: err.message || 'Erro inesperado no servidor'
    })
}