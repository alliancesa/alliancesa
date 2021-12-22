
var Sequelize = require('sequelize');

var userName = 'alliance';
var password = 'J3Wme9yRUh';
var hostName = '127.0.0.1';
var DbName = 'dballiance';

var sequelize = new Sequelize(DbName, userName, password, {
    host: hostName
    ,dialect: 'mysql'    
    
    ,logging: false // disable logging; default: console.log
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

