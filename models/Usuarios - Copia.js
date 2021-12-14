
const db = require("./db")

const Usuarios = db.sequelize.define('USUARIOS', {


    CLAN: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,CLASSE: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,DISCORD: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,EMAIL: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,FONE: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,NICK: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,NICK2: {
        type: db.Sequelize.STRING
        ,required: false
    }
    ,NIVEL: {
        type: db.Sequelize.INTEGER
        ,required: true
    }
    ,PODER: {
        type: db.Sequelize.INTEGER
        ,required: true
    }

    ,SENHA: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,STATUS: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 2
    }

})

const Esqueci = db.sequelize.define('ESQUECISENHAS',{
  CHAVE: {
    type: db.Sequelize.STRING
    ,require: true
  }
  ,EMAIL: {
    type: db.Sequelize.STRING
    ,require: true
  }
  ,STATUS: {
    type: db.Sequelize.STRING
    ,require: true
  }
})

Usuarios.sync({force: true})
Esqueci.sync({force: true})

module.exports = {
    Usuarios: Usuarios
    ,Esqueci: Esqueci
}