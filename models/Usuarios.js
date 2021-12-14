
const db = require("./db")

const Usuarios = db.sequelize.define('USUARIOS', {
    
    REGRA2: {
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
    ,SENHA: {
        type: db.Sequelize.STRING
        ,required: true
    }
    ,CHAVE: {
        type: db.Sequelize.STRING
        ,require: true
    }
    ,CHAVE2: {
        type: db.Sequelize.STRING
        ,require: true
    }
    ,ADMIN: {
        type: db.Sequelize.INTEGER
        ,required: true
        ,default: 2
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

//Usuarios.sync({force: true})
//Esqueci.sync({force: true})

module.exports = {
    Usuarios: Usuarios
    ,Esqueci: Esqueci
}