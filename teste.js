
var Sequelize = require('sequelize');
var sequelize = new Sequelize('heroku_766079f51950491', 'b49d959865b6d2', '8689a3e9', {
    host: 'us-cdbr-east-05.cleardb.net'
    ,dialect: 'mysql'
    
})


sequelize.authenticate().then(function(){
    console.log("Conectado")
}).catch(function(erro){
    console.log("Falha: " + erro)
})