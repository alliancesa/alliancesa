
var Sequelize = require('sequelize');

/*
var userName = 'sa';
var password = 'nN&dQ%g';
var hostName = 'localhost';
var sampleDbName = 'DbAlliance';

// Initialize Sequelize to connect to sample DB
var sequelize = new Sequelize(sampleDbName, userName, password, {
    dialect: 'mssql'
    ,host: hostName
    ,dialectOptions: {
        instanceName: ''
        ,trustedConnection: true
    }
    //,port: 64058 // Default port
    ,logging: false // disable logging; default: console.log

    ,dialectOptions: {
        requestTimeout: 100000 // timeout = 30 seconds
    }
});
*/

var userName = 'b49d959865b6d2';
var password = '8689a3e9';
var hostName = 'us-cdbr-east-05.cleardb.net';
var DbName = 'heroku_766079f51950491';

var sequelize = new Sequelize(DbName, userName, password, {
    host: hostName
    ,dialect: 'mysql'    
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

