
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
    ,ID_CLAN: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,ID_CLASSE: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,TIPO: {
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
    ,ANEL: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,ARMAS: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,BOTAS: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,COLAR: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,LUVAS: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,PERNAS: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,PULSEIRA: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,TORSO: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,TIERI: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,TIERII: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,TIERIII: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,TIERIV: {
        type: db.Sequelize.INTEGER
        ,required: false
    }
    ,STATUS: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 1
    }

})

const Eventos = db.sequelize.define('Eventos', {
    
    NOME: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,DATA: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,HORA: {
        type: db.Sequelize.STRING
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
//Personagens.sync({force: true})
//Eventos.sync({force: true})

module.exports = {
    Clans: Clans
    ,Classes: Classes
    ,Personagens: Personagens
    ,Eventos: Eventos
}