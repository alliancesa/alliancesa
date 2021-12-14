
const db = require("./db")

const Clans = db.sequelize.define('Clans', {
    
    NOME: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,STATUS: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 1
    }

})

const Classes = db.sequelize.define('Classes', {
    
    NOME: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,STATUS: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 1
    }

})

const Personagens = db.sequelize.define('Personagens', {
    
    ID_USUARIO: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,ID_CLASSE: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,NICK: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,NIVEL: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,PODER: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,STATUS: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 1
    }

})


//Clans.sync({force: true})
//Classes.sync({force: true})
Personagens.sync({force: true})

module.exports = {
    Clans: Clans
    ,Classes: Classes
    ,Personagens: Personagens
}