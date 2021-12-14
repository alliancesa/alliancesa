
const db = require("./db")




const Acessos = db.sequelize.define('Acessos', {
    ID_User: {
      type: db.Sequelize.STRING
      ,required: true
    }
    ,Codigo: {
      type: db.Sequelize.STRING
      ,required: true
    }
    ,SubCodigo: {
      type: db.Sequelize.STRING
      ,required: true
    }
    ,Adicionar: {
      type: db.Sequelize.INTEGER
      ,required: true
    }
    ,Alterar: {
      type: db.Sequelize.INTEGER
      ,required: true
    }
    ,Remover: {
      type: db.Sequelize.INTEGER
      ,required: true
    }
    ,Visualizar: {
      type: db.Sequelize.INTEGER
      ,required: true
    }
    ,Status: {
      type: db.Sequelize.STRING
      ,required: true
    }
})

const Modulos = db.sequelize.define('Modulos', {
  Codigo: {
    type: db.Sequelize.STRING
    ,required: true
  } 
  ,SubCodigo: {
    type: db.Sequelize.STRING
    ,required: true
  } 
  ,Descricao: {
    type: db.Sequelize.STRING
    ,required: true
  }
  ,Modulos: {
    type: db.Sequelize.STRING
    ,required: true
  }
  ,Status: {
    type: db.Sequelize.STRING
    ,required: true
  }
})

//Acessos.sync({force: true})
//Modulos.sync({force: true})

module.exports = {
    Acessos: Acessos
    ,Modulos: Modulos
}