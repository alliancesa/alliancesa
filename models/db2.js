
const mysql  		 = require('mysql2');

    var connection = mysql.createConnection({
        host: '127.0.0.1'
        ,user: 'alliance'
        ,password: 'J3Wme9yRUh'
        ,database: 'dballiance'
        ,multipleStatements: true
    });


module.exports = connection;