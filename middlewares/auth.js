const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
    eAdmin: async function (req, res, next) {
        const authHeader = req.headers.authorization;
        //console.log(authHeader);
        if(!authHeader) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Erro: Necessário realizar o login para acessar a página! Falta o token A!'
            });
        }

        const [bearer, token] = authHeader.split(' ');
        console.log('Token: ' + token);

        if(!token) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Erro: Necessário realizar o login para acessar a página! Falta o token B'
            });
        }

        try {
            const decode = await promisify(jwt.verify)(token, 'D2893H8IIOI238U98UEOFJWIEJF');
            req.userId = decode.id; 
            return next();
        }catch(err) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Erro: Necessário realizar o login para acessar a página! Token inválido'
            });
        }
    }
}