const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {eAdmin} = require('./middlewares/auth');
const db = require('./models/db');
const User = require('./models/users');

app.use(express.json());

app.get('/', eAdmin ,async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'password'],
        order: [['id', 'DESC']]
    })
    .then((users) => {
            return res.json({
        erro: false,
        users,
        id_usuario_logado: req.userId
    });
    })
    .catch(() => {
        return res.json({
            erro: false,
            mensagem: "Nenhum usuário encontrado!"
        });
    })

});

app.post('/cadastrar',  async (req, res) => {

    var dados = req.body;

    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: 'Erro: cadastro não efetuado!'
        });
    });

    return res.json({
        erro: false,
        mensagem: 'Cadastrar usuário',
        
    });
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    });

    if(user === null) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Erro: Usuário ou senha incorreta!'
        });
    }


    if(!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Erro: Usuário ou senha incorreta!'
    })};

    var token = jwt.sign({id: user.id}, 'D2893H8IIOI238U98UEOFJWIEJF', {
        //expiresIn: 600,  // Isso é 10 minutos
        //expiresIn: 60 // 1 min
        expiresIn: '7d' // Isso é 7 dia
    });

    return res.json({
        erro: false,
        mensagem: 'Login realizado com sucesso!',
        token: token
    });
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080, porta: http://localhost:8080');
});