const express = require('express');
const router = express.Router();
const db = require("../../models/db")
const db2 = require("../../models/db2")
const Post = require('../../models/Admin');

const { Admin } = require("../../helpers/Admin")

    // Variaveis Globais
    aMenu   = []
    aModulo = []
    aRotina = []

    // Busca Dados Banco do ERPcls
    function BuscaDados(sqlQry, res) {
        conn.request()
            .query(sqlQry)
            .then(result => {
                res.json(result.recordset)
            })
            .catch(err => res.json(err));
    }

    router.get('/Modulos/', Admin, function (req, res) {
        cMod = " SELECT                  "
        cMod += "    *                    "
        cMod += " FROM                    "
        cMod += "    Modulos              "
        cMod += " WHERE                   "
        cMod += "    Status = '1'         "
        cMod += "    AND SubCodigo = ''   "
        cMod += " ORDER BY                "
        cMod += "    Codigo               "

        cMod2 = " SELECT                            "
        cMod2 += "   *                              "
        cMod2 += " FROM                             "
        cMod2 += "   Modulos                        "
        cMod2 += " WHERE                            "
        cMod2 += "    Status = '1'                  "
        cMod2 += "    AND SubCodigo <> ''           "
        cMod2 += " ORDER BY                         "
        cMod2 += "   Descricao                      "

        conn.request().query(cMod).then(dados => {
            conn.request().query(cMod2).then(dados2 => {
                aModulos = dados.recordset
                aModulos2 = dados2.recordset
                res.render('admin/Modulos/list', {
                    aModulos
                    ,aModulos2
                    ,aModulosMenu: aMenu
                    ,aRotina
                });
            })
        })
    });

    router.post('/Modulos/', Admin, function (req, res) {
        if(req.body.cParam1 == 1) {
            cQry  = " SELECT                                              "
            cQry += "   TIPO                                              "
            cQry += "   ,MODULO                                           "
            cQry += "   ,ROTINA                                           "
            cQry += "   ,DESCRICAO                                        "
            cQry += "   ,RELATORIO                                        "
            cQry += "   ,STATUS                                           "
            cQry += " FROM                                                "
            cQry += "   ADM_MODULOS                                       "
            cQry += " ORDER BY                                            "
            cQry += "   TIPO                                              "
            cQry += "   ,MODULO                                           "
            cQry += "   ,RELATORIO                                        "
            cQry += "   ,ROTINA                                           "

/*
            cQry  = " SELECT                                              "
            cQry += "   TIPO                                              "
            cQry += "   ,MODULO                                           "
            cQry += "   ,RELATORIOS                                       "
            cQry += "   ,PROGRAMA                                         "
            cQry += "   ,Descricao                                        "
            cQry += " FROM                                                "
            cQry += "   Modulos                                           "
            cQry += " WHERE                                               "
            cQry += "   TIPO <> ''                                        "
            cQry += "   AND MODULO <> ''                                  "
            cQry += "   AND RELATORIOS <> ''                              "
            cQry += "   AND PROGRAMA <> ''                                "
            cQry += " ORDER BY                                            "
            cQry += "   TIPO                                              "
            cQry += "   ,MODULO                                           "
            cQry += "   ,RELATORIOS                                       "
            cQry += "   ,PROGRAMA                                         "
*/            
        }

        BuscaDados(cQry, res)
    })

    router.get('/Modulos/add', Admin, function (req, res) {
        cUsu = " SELECT                           "
        cUsu += "   *                              "
        cUsu += " FROM                             "
        cUsu += "   Modulos                        "
        cUsu += " WHERE                            "
        cUsu += "   SubCodigo = ''                 "
        cUsu += " ORDER BY                         "
        cUsu += "   Codigo                         "

        conn.request().query(cUsu).then(dados => {
            aModulos = dados.recordset
            res.render('admin/Modulos/add', {
                aModulosMenu: aMenu
                ,aModulos
                ,aRotina
            });
        })
    });

    router.post('/Modulos/add', Admin, function (req, res) {
        // verifica os erros
        var erros = [];
        var cCodigo = ""

        if (req.body.CodigoPai != "") {
            cCodigo = req.body.CodigoPai
        } else {
            cCodigo = req.body.Codigo
        }
        Post.Modulos.findAll().then(function (dados) {
            aDados = dados;

            if (req.body.CodigoPai != "" && req.body.Codigo != "") {
                erros.push({ texto: "Código Pai e Código estão preenchidos, favor verificar ! " })
            }

            if (req.body.Codigo != "" && req.body.SubCodigo == "") {
                erros.push({ texto: "Código Pai preenchido, Sub-Codigo deve estar preenchido ! " })
            }

            for (let i = 0; i < aDados.length; i++) {
                if (aDados[i].Codigo == req.body.CodigoPai) {
                    erros.push({ texto: "Código já cadastrado! " })
                }
                if (aDados[i].SubCodigo == req.body.SubCodigo && aDados[i].Codigo == cCodigo && req.body.Codigo != "") {
                    erros.push({ texto: "Sub-Código já cadastrado! " })
                }
                if (aDados[i].Descricao == req.body.Descricao && aDados[i].Codigo == cCodigo && req.body.CodigoPai != "") {
                    erros.push({ texto: "Descrição já cadastrado! " })
                }
            }

            if (req.body.CodigoPai.length != 2 && req.body.CodigoPai != "") {
                erros.push({ texto: "Código deve conter 2 carecteres" })
            }

            if (req.body.Codigo.length != 2 && req.body.Codigo != "") {
                erros.push({ texto: "Código deve conter 2 carecteres" })
            }

            if (erros.length > 0) {
                res.render("admin/Modulos/add", {
                    erros: erros
                    , aMenu
                    , aModulosMenu: aMenu
                })
            } else {
                Post.Modulos.create({
                    Codigo: cCodigo
                    ,SubCodigo: req.body.SubCodigo
                    ,Descricao: req.body.Descricao
                    ,Modulos: req.body.Modulos
                    ,Status: 1
                }).then(function () {
                    req.flash("success_msg", "Cadastro realizado com sucesso!");
                    res.redirect("/admin/Modulos");

                }).catch(function (erro) {
                    req.flash("error_msg", "Houve um erro ao salvar, tente novamente! " + erro);
                    res.redirect("/admin/Modulos");
                })
            }
        })
    });











    


    router.get('/Modulos/del', Admin, function (req, res) {
        cMod = " SELECT                  "
        cMod += "    *                    "
        cMod += " FROM                    "
        cMod += "    Modulos              "
        cMod += " WHERE                   "
        cMod += "    Status = '1'         "
        cMod += "    AND SubCodigo = ''   "
        cMod += " ORDER BY                "
        cMod += "    Codigo               "

        cMod2 = " SELECT                           "
        cMod2 += "   *                              "
        cMod2 += " FROM                             "
        cMod2 += "   Modulos                        "
        cMod2 += " WHERE                            "
        cMod2 += "    Status = '1'                  "
        cMod2 += "    AND SubCodigo <> ''           "
        cMod2 += " ORDER BY                         "
        cMod2 += "   Codigo                         "

        conn.request().query(cMod).then(dados => {
            conn.request().query(cMod2).then(dados2 => {
                aModulos = dados.recordset
                aModulos2 = dados2.recordset
                res.render('Admin/Modulos/del', {
                    aModulos
                    ,aModulos2
                    ,aModulosMenu: aMenu
                    ,aModulosList: aMenu
                    ,aRotina
                })
            })
        
        })
    })

    router.get('/Modulos/del/:id', Admin, function (req, res) {
        cMod = " SELECT                                 "
        cMod += "    *                                  "
        cMod += " FROM                                  "
        cMod += "    Modulos                            "
        cMod += " WHERE                                 "
        cMod += "    Status = '1'                       "
        cMod += "    AND SubCodigo = ''                 "
        cMod += "    AND Codigo= '" + req.params.id +  "'   "
        cMod += " ORDER BY                              "
        cMod += "    Codigo                             "

        cMod2 = " SELECT                                "    
        cMod2 += "   *                                  "
        cMod2 += " FROM                                 "
        cMod2 += "   Modulos                            "
        cMod2 += " WHERE                                "
        cMod2 += "    Status = '1'                      "
        cMod2 += "    AND SubCodigo <> ''               "
        cMod2 += " ORDER BY                             "
        cMod2 += "   Codigo                             "

        cMod3 = " SELECT                                 "
        cMod3 += "    *                                  "
        cMod3 += " FROM                                  "
        cMod3 += "    Modulos                            "
        cMod3 += " WHERE                                 "
        cMod3 += "    Status = '1'                       "
        cMod3 += "    AND Codigo= '" + req.params.id +  "'   "

        conn.request().query(cMod).then(dados => {
            conn.request().query(cMod2).then(dados2 => {
                conn.request().query(cMod3).then(dados3 => {
                    aModulos = dados.recordset
                    aModulos2 = dados2.recordset
                    if(dados3.recordset.length != 1) {
                        res.render('Admin/Modulos/del', {
                            aModulos
                            ,aModulos2
                            ,aModulosMenu: aMenu
                            ,aSubModulosList: aMenu
                            ,aRotina
                        })
                    } else {
                        Post.Modulos.destroy({ where: { 
                            Codigo: req.params.id
                            ,SubCodigo: ""
                        } })
                            .then(function () {
                                req.flash("success_msg", "Cadastro removido com sucesso!");
                                res.redirect("/Admin/Modulos");
                            }).catch(function (erro) {
                                req.flash("error_msg", "Houve um erro ao remover o cadastro, tente novamente!" + erro);
                                res.redirect("Admin/Modulos");
                        })
                    }
                })      
            })
        })
    })

    router.post('/Modulos/del', Admin, function (req, res) {
        Post.Modulos.destroy({ where: { 
            Codigo: req.body.Codigo
            ,SubCodigo: req.body.SubCodigo
        } })
            .then(function () {
                req.flash("success_msg", "Cadastro removido com sucesso!");
                res.redirect("del");
            }).catch(function (erro) {
                req.flash("error_msg", "Houve um erro ao remover o cadastro, tente novamente!" + erro);
                res.redirect("del");
            })
    });

module.exports = router;