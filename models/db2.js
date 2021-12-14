
const sql 		 = require('mssql');
//const connStr  = "Server='192.168.1.3\\MICROSIGA';Database=DbFabrica;User Id=sa;Password=S1g@;";

const config = {
    //user: process.env.DB_USER
    //,password: process.env.DB_PWD
    //,database: process.env.DB_NAME
    user: 'sa'
    ,password: 'nN&dQ%g'
    ,database: 'DbAlliance'
    ,server  : 'localhost'
    
    ,requestTimeout: 120000  //default: 15000
    ,pool    : {
            max: 10
            ,min: 0
            ,idleTimeoutMillis: 60000
    }
    ,options: {
        encrypt: false // for azure
        ,trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

//fazendo a conex?o global
//sql.connect(connStr)
sql.connect(config)
   .then(conn => global.conn = conn)
   .catch(err => console.log("-----------> Erro de conexão: " + err));
   
       
module.exports = {
    Sql: sql
    //ConnStr: connStr
}
