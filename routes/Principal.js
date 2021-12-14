const express = require('express');
const router  = express.Router();
const db      = require("../models/db")
const Cadastros    = require('../models/Cadastros');
const request = require('request');

const {AuthUsuarios}   = require("../helpers/Usuarios")

    // PRINCIPAL = 0 Normal
    // PRINCIPAL = 1 Gerancial por empresa
    // PRINCIPAL = 2 Gerencial Todas empresas


    // Busca Dados Banco do ERPcls
    function BuscaDados(sqlQry, res) {
        conn.request()
            .query(sqlQry)
            .then(result => {
                res.json(result.recordset)
            })
            .catch(err => res.json(err));
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
            } else if(req.user.PRINCIPAL == '2') {    
                res.render("Principal/Gerencial2", {
                    aAdminMenu: aAdminMenu 
                    ,aMenu 
                    ,aModulo
                    ,aRotina
                    ,aLogin
                })
            } else {
                res.render("Principal/index", {
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
        } else if(req.user.PRINCIPAL == '2') {         
            res.render("Principal/Gerencial2", {
                aMenu 
                ,aModulo
                ,aRotina
                ,aLogin
            })
        } else {

            Cadastros.Clans.findAll( ).then((dados) => {
            
            })
            
            Cadastros.Classes.findAll( ).then((dados) => {
            
            })

            res.render("Principal/index", {
                aMenu 
                ,aModulo
                ,aRotina
                ,aLogin
            })
        
        }     
    }); 
    
    
    router.get('/Gerencial1', AuthUsuarios, (req, res) => {
        if(req.user.Admin == 1) {
            res.render("Principal/Gerencial1", {
                aMenu 
                ,aModulo
                ,aRotina
            })
        } else {
            res.render("Principal/index", {
                aMenu 
                ,aModulo
                ,aRotina
            })
        }
    })

    router.post('/Gerencial1', AuthUsuarios, function(req, res){   
        if(req.body.cParam1 == 1) { // Faturamento - MIL R$
            cQry  = " SELECT                                                                                                "
            cQry += "    *                                                                                                  "
            cQry += " FROM                                                                                                  "
            cQry += "    vwFAT001_V2                                                                                        "
            cQry +=  " WHERE                                                                                                "
            cQry += "     EMPRESA+FILIAL = '" + req.body.cParam2.split("_")[0] + req.body.cParam2.split("_")[1] +"'         "
        }
        BuscaDados(cQry, res)
    })


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

    router.post('/Personagens', AuthUsuarios, (req, res) => {
        

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