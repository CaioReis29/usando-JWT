const Sequelize = require('sequelize');

const sequelize = new Sequelize('jwt', 'root', 'caiocezar14', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log('Conectou com o banco de dados!');
})
.catch(() => {
    console.log('Não conseguiu conectar com o banco de dados!');
})

module.exports = sequelize;