const express   = require('express');
const router    = express.Router();
const db        = require("../models/db")
const Cadastros = require('../models/Cadastros');
const db2       = require('../models/db2');

const {AuthUsuarios}   = require("../helpers/Usuarios")

    // PRINCIPAL = 0 Normal
    // PRINCIPAL = 1 Gerancial por empresa
    // PRINCIPAL = 2 Gerencial Todas empresas

    function BuscaDados(cQry, res, nTipo) {
        db2.query(cQry, function (err, result, fields) {
            if(err){
                res.json(err)    
            } else {
                if(nTipo == 1){
                    res.json(result)    
                } else if(nTipo == 2) {
                    res.json(result[7])
                }
            }
        });
    }

    // Variaveis Globais
    aMenu   = []
    aModulo = []
    aRotina = []   


    router.get('/', AuthUsuarios, (req, res) => {
        if(nBemVindo==0){
            aMenu.push("OK")
            nBemVindo++
        }

        var aLogin = req.user.EMAIL

        if(req.user.Admin == 1) {
            aAdminMenu = req.user.Admin        
            if(req.user.PRINCIPAL == '1') {    
                res.render("Principal/Gerencial1", {
                    aAdminMenu: aAdminMenu 
                    ,aMenu 
                    ,aModulo
                    ,aRotina
                    ,aLogin
                })
            }

        } else if(req.user.PRINCIPAL == '1') {         
            res.render("Principal/Gerencial1", {
                aMenu 
                ,aModulo
                ,aRotina
                ,aLogin
            })
        } else {
            var aClansTotal
            var aClans = []
            var aClasses = []
            
            Cadastros.Classes.findAll( ).then((dados) => {
                for (let i = 0; i < dados.length; i++) {
                    aClasses.push(dados[i].NOME)
                }
        
                Cadastros.Clans.findAll( ).then((dados) => {
                    for (let i = 0; i < dados.length; i++) {
                        aClans.push(dados[i].NOME)
                    }

                    aClansTotal = dados.length
            
                    res.render("Principal/index", {
                        aMenu 
                        ,aModulo
                        ,aRotina
                        ,aLogin
                        ,aClans
                        ,aClansTotal
                        ,aClasses
                    })
                })
            })
        }     
    }); 
    

    router.get('/Clans', AuthUsuarios, (req, res) => {
        res.render("Principal/Clans", {
            aMenu 
        })
    })

    router.post('/Clans', AuthUsuarios, (req, res) => {
        var erros = []
    
        if(!req.body.nome || typeof req.body.nome  == undefined || req.body.nome == null){
            erros.push({texto: "Nome Inválido"})
        }

        // Valida erros e adiciona registro
        if(erros.length > 0){
            req.flash("error_msg", "Campo inválido")
            res.render("Principal/Clans", {erros: erros})
        } else {
            //Post.Usuarios.findOne({EMAIL: req.body.email}).then((usuarios) => {
            Cadastros.Clans.findAll({
                where: {
                    NOME: req.body.nome
                }
            }).then(function(dados) {          
                if(dados.length > 0){
                    req.flash("error_msg", "Já existe um Clan com esse nome.")
                    res.redirect("Clans")
                } else {

                    const NovaClasse = new Cadastros.Clans ({
                        NOME     :  req.body.nome
                        ,STATUS  :  1
                    })

                    NovaClasse.save().then(() => {
                        req.flash("success_msg", "Novo Clan cadastrado com sucesso!")
                        res.redirect("Clans")

                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao criar um nov Clan, tente novamente")
                        res.redirect("Clans")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("Clans")
            })
        }
    })


    router.get('/Classes', AuthUsuarios, (req, res) => {
        res.render("Principal/Classes", {
            aMenu 
        })
    })

    router.post('/Classes', AuthUsuarios, (req, res) => {
        var erros = []
    
        if(!req.body.nome || typeof req.body.nome  == undefined || req.body.nome == null){
            erros.push({texto: "Nome Inválido"})
        }

        // Valida erros e adiciona registro
        if(erros.length > 0){
            req.flash("error_msg", "Campo inválido")
            res.render("Principal/Classes", {erros: erros})
        } else {
            //Post.Usuarios.findOne({EMAIL: req.body.email}).then((usuarios) => {
            Cadastros.Classes.findAll({
                where: {
                    NOME: req.body.nome
                }
            }).then(function(dados) {          
                if(dados.length > 0){
                    req.flash("error_msg", "Já existe uma classe com esse nome.")
                    res.redirect("Classes")
                } else {

                    const NovaClasse = new Cadastros.Classes ({
                        NOME     :  req.body.nome
                        ,STATUS  :  1
                    })

                    NovaClasse.save().then(() => {
                        req.flash("success_msg", "Nova classe cadastrada com sucesso!")
                        res.redirect("Classes")

                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao criar uma nova classe, tente novamente")
                        res.redirect("Classes")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("Classes")
            })
        }
    })



    router.get('/Personagens', AuthUsuarios, (req, res) => {
        var aClans   = []
        var aClasses = []
        

        Cadastros.Clans.findAll({}).then(function(dados) { 
            for (let i = 0; i < dados.length; i++) {
                
                aClans.push( { 
                    ID: dados[i].id
                    ,NOME: dados[i].NOME
                 })
            }

            Cadastros.Classes.findAll({}).then(function(dados) { 
                for (let i = 0; i < dados.length; i++) {
                    
                    aClasses.push( { 
                        ID: dados[i].id
                        ,NOME: dados[i].NOME
                    })
                }

                res.render("Principal/Personagens", {
                    aMenu 
                    ,aClans
                    ,aClasses
                })
            })
        })
    })

    router.get('/Eventos', AuthUsuarios, (req, res) => {
        res.render("Principal/Eventos", {
            aMenu 
        })
    })

    router.post('/Eventos', AuthUsuarios, (req, res) => {
        var erros = []
    
        if(!req.body.nome || typeof req.body.nome  == undefined || req.body.nome == null){
            erros.push({texto: "Nome Inválido"})
        }
        
        if(!req.body.data || typeof req.body.data  == undefined || req.body.data == null){
            erros.push({texto: "Data Inválido"})
        }

        if(!req.body.hora || typeof req.body.hora  == undefined || req.body.hora == null){
            erros.push({texto: "Hora Inválido"})
        }

        // Valida erros e adiciona registro
        if(erros.length > 0){
            req.flash("error_msg", "Campo inválido")
            res.render("Principal/Eventos", {erros: erros})
        } else {
            //Post.Usuarios.findOne({EMAIL: req.body.email}).then((usuarios) => {
            Cadastros.Eventos.findAll({
                where: {
                    NOME: req.body.nome
                }
            }).then(function(dados) {          
                if(dados.length > 0){
                    req.flash("error_msg", "Já existe um Evento com esse nome.")
                    res.redirect("Eventos")
                } else {

                    const NovoEventos = new Cadastros.Eventos ({
                        NOME     :  req.body.nome
                        ,DATA    :  req.body.data
                        ,HORA    :  req.body.hora
                        ,STATUS  :  1
                    })

                    NovoEventos.save().then(() => {
                        req.flash("success_msg", "Novo Evento cadastrado com sucesso!")
                        res.redirect("Eventos")

                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao criar um novo evento, tente novamente")
                        res.redirect("Eventos")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("Eventos")
            })
        }
    })


    router.post('/Personagens', AuthUsuarios, (req, res) => {
        var erros = []
    
        if(!req.body.nick || typeof req.body.nick  == undefined || req.body.nick == null){
            erros.push({texto: "Nick Inválido"})
        }

        // Valida erros e adiciona registro
        if(erros.length > 0){
            req.flash("error_msg", "Campo inválido")
            res.redirect("/Personagens");
        } else {
            Cadastros.Personagens.findAll({
                where: {
                    TIPO: req.body.tipo
                    ,ID_USUARIO: req.user.id
                }
            }).then(function(dados) {          
                if(dados.length > 0){
                    if(dados[0].dataValues.TIPO != parseInt(req.body.tipo)){
                        req.flash("error_msg", "Tipo de Conta já registrada, favor realizar a mudança e tentar novamente!")
                        res.redirect("/Personagens");
                    } else if(dados[0].dataValues.NICK != req.body.nick){
                        req.flash("error_msg", "Tipo de Conta já registrada, favor realizar a mudança e tentar novamente!")
                        res.redirect("/Personagens");
                    } else {
                        Cadastros.Personagens.findAll({
                            where: {
                                NICK: req.body.nick
                                ,ID_USUARIO: req.user.id
                            }
                        }).then(function(dados) {          
                            if(dados.length > 0){
                                const AlteraPersonagens = ({
                                    ID_USUARIO:  req.user.id
                                    ,TIPO     :  parseInt(req.body.tipo)
                                    ,NICK     :  req.body.nick
                                    ,ID_CLAN  :  parseInt(req.body.clan)
                                    ,ID_CLASSE:  parseInt(req.body.classe)
                                    ,NIVEL    :  parseInt(req.body.nivel)
                                    ,PODER    :  parseInt(req.body.poder)
                                    ,TIERIV   :  parseInt(req.body.TierIV)
                                    ,TIERIII  :  parseInt(req.body.TierIII)
                                    ,TIERII   :  parseInt(req.body.TierII)
                                    ,TIERI    :  parseInt(req.body.TierI)
                                    ,STATUS   :  1
                                })
                                
                                Cadastros.Personagens.update(AlteraPersonagens, { where: { id: dados[0].id } })
                                .then(function() {
                                    req.flash("success_msg", "Cadastro alterado com sucesso!");
                                    res.redirect("/Personagens");
                                }).catch(function (erro) {
                                    req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!  " + erro);
                                    res.redirect("/Personagens");
                                })
                            } else {
                                const NovaPersonsagem = new Cadastros.Personagens ({
                                    ID_USUARIO:  req.user.id
                                    ,TIPO     :  parseInt(req.body.tipo)
                                    ,NICK     :  req.body.nick
                                    ,ID_CLAN  :  parseInt(req.body.clan)
                                    ,ID_CLASSE:  parseInt(req.body.classe)
                                    ,NIVEL    :  parseInt(req.body.nivel)
                                    ,PODER    :  parseInt(req.body.poder)
                                    ,TIERIV   :  parseInt(req.body.TierIV)
                                    ,TIERIII  :  parseInt(req.body.TierIII)
                                    ,TIERII   :  parseInt(req.body.TierII)
                                    ,TIERI    :  parseInt(req.body.TierI)
                                    ,STATUS   :  1
                                })
        
                                NovaPersonsagem.save().then(() => {
                                    req.flash("success_msg", "Nova personagem cadastrada com sucesso!")
                                    res.redirect("Personagens")
        
                                }).catch((err) => {
                                    req.flash("error_msg", "Houve um erro ao criar uma nova personagem, tente novamente")
                                    res.redirect("Personagens")
                                })
                            }
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar uma nova personagem, tente novamente")
                            res.redirect("Personagens")
                        })
                    }
                } else {
                    Cadastros.Personagens.findAll({
                        where: {
                            NICK: req.body.nick
                            ,ID_USUARIO: req.user.id
                        }
                    }).then(function(dados) {          
                        if(dados.length > 0){
                            const AlteraPersonagens = ({
                                ID_USUARIO:  req.user.id
                                ,TIPO     :  parseInt(req.body.tipo)
                                ,NICK     :  req.body.nick
                                ,ID_CLAN  :  parseInt(req.body.clan)
                                ,ID_CLASSE:  parseInt(req.body.classe)
                                ,NIVEL    :  parseInt(req.body.nivel)
                                ,PODER    :  parseInt(req.body.poder)
                                ,TIERIV   :  parseInt(req.body.TierIV)
                                ,TIERIII  :  parseInt(req.body.TierIII)
                                ,TIERII   :  parseInt(req.body.TierII)
                                ,TIERI    :  parseInt(req.body.TierI)
                                ,STATUS   :  1
                            })
                            
                            Cadastros.Personagens.update(AlteraPersonagens, { where: { id: dados[0].id } })
                            .then(function() {
                                req.flash("success_msg", "Cadastro alterado com sucesso!");
                                res.redirect("/Personagens");
                            }).catch(function (erro) {
                                req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!  " + erro);
                                res.redirect("/Personagens");
                            })
                        } else {
                            const NovaPersonsagem = new Cadastros.Personagens ({
                                ID_USUARIO:  req.user.id
                                ,TIPO     :  parseInt(req.body.tipo)
                                ,NICK     :  req.body.nick
                                ,ID_CLAN  :  parseInt(req.body.clan)
                                ,ID_CLASSE:  parseInt(req.body.classe)
                                ,NIVEL    :  parseInt(req.body.nivel)
                                ,PODER    :  parseInt(req.body.poder)
                                ,TIERIV   :  parseInt(req.body.TierIV)
                                ,TIERIII  :  parseInt(req.body.TierIII)
                                ,TIERII   :  parseInt(req.body.TierII)
                                ,TIERI    :  parseInt(req.body.TierI)
                                ,STATUS   :  1
                            })
    
                            NovaPersonsagem.save().then(() => {
                                req.flash("success_msg", "Nova personagem cadastrada com sucesso!")
                                res.redirect("Personagens")
    
                            }).catch((err) => {
                                req.flash("error_msg", "Houve um erro ao criar uma nova personagem, tente novamente")
                                res.redirect("Personagens")
                            })
                        }
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro interno")
                        res.redirect("Personagens")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("Personagens")
            })
        }
    })

    router.post('/Personagens2', AuthUsuarios, (req, res) => {
        cQry  = " SELECT                                            "
        cQry += "   PER.id                                          "
        cQry += "   ,TIPO                                           "
        cQry += "   ,NICK                                           "
        cQry += "   ,ID_CLAN                                        "
        cQry += "   ,CLA.NOME CLAN                                  "
        cQry += "   ,ID_CLASSE                                      "
        cQry += "   ,CLAS.NOME CLASSE                               "
        cQry += "   ,NIVEL                                          "
        cQry += "   ,PODER                                          "
        cQry += "   ,TIERI                                          "
        cQry += "   ,TIERII                                         "
        cQry += "   ,TIERIII                                        "
        cQry += "   ,TIERIV                                         "
        cQry += " FROM                                              "
        cQry += "   Personagens PER                                 "
        cQry += "   INNER JOIN USUARIOs USU ON                      "
        cQry += "      USU.id = ID_USUARIO                          "
        cQry += "   INNER JOIN Clans CLA ON                         "
        cQry += "      CLA.id = ID_CLAN                             "
        cQry += "   INNER JOIN Classes CLAS ON                      "
        cQry += "      CLAS.id = ID_CLASSE                          "
        cQry += " WHERE                                             "
        cQry += "   ID_USUARIO = " + req.user.id + "                "

        BuscaDados(cQry, res, 1)
    })



    router.post('/Rank', AuthUsuarios, (req, res) => {
        cQry  = " SET @nItem    = 1.5;                             \n "  
        cQry += " SET @nLevel   = 6;                               \n "
        cQry += " SET @nPoder   = 3;                               \n "
        cQry += " SET @nPesoIV  = 16;                              \n "
        cQry += " SET @nPesoIII = 8;                               \n "
        cQry += " SET @nPesoII  = 4;                               \n "
        cQry += " SET @nPesoI   = 1;                               \n "
                           
        cQry += " SELECT                                           \n "
        //cQry += "   @nLevel    * NIVEL                              "
        //cQry += "   ,@nPoder   * PODER                              "
        //cQry += "   ,@nPesoIV  * TIERIV                             "
        //cQry += "   ,@nPesoIII * TIERIII                            "
        //cQry += "   ,@nPesoII  * TIERII                             "
        //cQry += "   ,@nPesoI   * TIERI                              "
        cQry += "   PER.id                                         \n "
        cQry += "   ,TIPO                                          \n "
        cQry += "   ,NICK                                          \n "
        cQry += "   ,ID_CLAN                                       \n "
        cQry += "   ,CLA.NOME CLAN                                 \n "
        cQry += "   ,ID_CLASSE                                     \n "
        cQry += "   ,CLAS.NOME CLASSE                              \n "
        cQry += "   ,NIVEL                                         \n "
        cQry += "   ,PODER                                         \n "
        cQry += "   ,(@nPesoIV*TIERIV)+(@nPesoIII*TIERIII)+(@nPesoII*TIERII)+(@nPesoI*TIERI) ITEM  \n "
        cQry += "   ,TIERI                                         \n "
        cQry += "   ,TIERII                                        \n "
        cQry += "   ,TIERIII                                       \n "
        cQry += "   ,TIERIV                                        \n "
        cQry += "   ,ROUND((@nLevel*NIVEL)+(@nPoder*PODER)+(@nItem*((@nPesoIV*TIERIV)+(@nPesoIII*TIERIII)+(@nPesoII*TIERII)+(@nPesoI*TIERI))), 0) _RANK \n "
        cQry += " FROM                                             \n "
        cQry += "   Personagens PER                                \n "
        cQry += "   INNER JOIN USUARIOs USU ON                     \n "
        cQry += "      USU.id = ID_USUARIO                         \n "
        cQry += "   INNER JOIN Clans CLA ON                        \n "
        cQry += "      CLA.id = ID_CLAN                            \n "
        cQry += "   INNER JOIN Classes CLAS ON                     \n "
        cQry += "      CLAS.id = ID_CLASSE                         \n "
        //cQry += " WHERE                                             "
        //cQry += "   ID_USUARIO = 4                                  "
        cQry += " ORDER BY                                         \n "
        cQry += "   _RANK DESC                                     \n "
        cQry += "   ,NIVEL                                         \n "
        cQry += "   ,PODER                                         \n "
        cQry += "   ,ITEM                                          \n "
        cQry += "   ,NICK                                          \n "
        //cQry += " WHERE                                             "
        //cQry += "   ID_USUARIO = 4                                  "

        BuscaDados(cQry, res, 2)

    })
        
        
    
module.exports = router;

    var cData
    var cDataAtual 
    var cHora

    function CarregaData() {
        cData = new Date();
        // Guarda cada pedaço em uma variável
        var cDia       = cData.getDate();                                       // 1-31
        var cMes       = cData.getMonth();                                      // 0-11 (zero=janeiro)
        var cMesAnt    = cData.getMonth()-1;                                    // 0-11 (zero=janeiro)
        var cAno4      = cData.getFullYear();                                   // 4 dígitos
        var cUltDiaMes = new Date(cData.getFullYear(), cData.getMonth() + 1, 0);  // Ultimo dia Mes

        // Formata a data e a hora (note o mês + 1)
        if (cDia < 10) { cDia = '0' + cDia }
        if (cMes < 9 ) { cMes = '0' + (cMes + 1) } else { cMes = (cMes + 1).toString() }
        if (cMesAnt < 9 ) { cMesAnt = '0' + (cMesAnt + 1) } else { cMesAnt = (cMesAnt + 1).toString() }

        cDataAtual = cDia + '/' + cMes + '/' + cAno4;
        cHora = Date().substring(16, 18)+':'+Date().substring(19, 21)+':'+Date().substring(22, 24)
    }
    