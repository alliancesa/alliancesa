const express = require('express');
const router = express.Router();
const db = require("../../models/db")
const db2 = require("../../models/db2")
const Post = require('../../models/Admin');

const { Admin } = require("../../helpers/Admin")
const {BuscaReal}   = require("../../helpers/BuscaReal")

    // Variaveis Globais
    aMenu   = []
    aModulo = []
    aRotina = []

    function BuscaDados(sqlQry, res){
        conn.request()
                .query(sqlQry)
                .then(result =>  {
                    res.json(result.recordset)
                })
                .catch(err => res.json(err));
    }

    router.get('/Acessos/', Admin, function (req, res) {
        cQry = " SELECT                                     "
        cQry += "   Usu.id                                  "
        cQry += "   ,Usu.Nome                               "
        cQry += " FROM                                      "
        cQry += "   Usuarios Usu                            "
        cQry += " WHERE                                     "
        cQry += "    STATUS <> '2'                          "
        cQry += " ORDER BY                                  "
        cQry += "   Usu.Nome                                "

        conn.request().query(cQry).then(dados => {
            aUsuarios = dados.recordset
            res.render('admin/Acessos/add', {
                aAdmin: aMenu
                ,aAdminMenu: aMenu
                ,aUsuarios
                ,aRotina
            })
        })
    })

    router.post('/Acessos/List', BuscaReal, function (req, res) {
        if(req.body.cParam1 == 1) {
            cQry  = " SELECT                                                                "
            cQry += "    MOD.ID                                                             "
            cQry += "    ,TIPO                                                              "
            cQry += "    ,MODULO                                                            "
            cQry += "    ,ROTINA                                                            "
            cQry += "    ,DESCRICAO                                                         "
            cQry += "    ,RELATORIO                                                         "
            cQry += "    ,STATUS                                                            "
            cQry += "  	 ,CASE WHEN ACE.ID IS NULL        THEN '' ELSE 'X' END VISUALIZAR   "
            cQry += "  	 ,CASE WHEN ACE.ADICIONAR IS NULL THEN ''                           "
            cQry += "  	       WHEN ACE.ADICIONAR = 0     THEN '' ELSE 'X' END ADICIONAR    "
            cQry += "  	 ,CASE WHEN ACE.ALTERAR   IS NULL THEN ''                           "
            cQry += "  	       WHEN ACE.ALTERAR = 0     THEN '' ELSE 'X' END ALTERAR		"
            cQry += "  	 ,CASE WHEN ACE.REMOVER   IS NULL THEN ''                           "
            cQry += "  	       WHEN ACE.REMOVER = 0     THEN '' ELSE 'X' END REMOVER        "
            cQry += " FROM                                                                  "
            cQry += "    ADM_MODULOS MOD                                                    "
            cQry += "    LEFT JOIN DbFabrica.dbo.ADM_ACESSOS ACE ON                         "
            cQry += "       MOD.ID = ACE.ID_MODULO                                          "
            cQry += "       AND ACE.ID_USER = " + req.body.cParam2
            cQry += " WHERE                                                                 "
            cQry += "    STATUS = 1                                                         "
            cQry += " ORDER BY                                                              "
            cQry += "    TIPO                                                               "
            cQry += "    ,MODULO                                                            "
            cQry += "    ,RELATORIO                                                         "
            cQry += "    ,ROTINA                                                            "

            BuscaDados(cQry, res)
        } else if(req.body.cParam1 == 3) {
            var nUser  = req.body.cParam2
            var aItens = req.body.cParam3
            var lOK    = false
            var cQry   = ''

            for (let i = 0; i < aItens.length; i++) {
                if(aItens[i][0][1] == 'true' ||
                   aItens[i][1][1] == 'true' ||
                   aItens[i][2][1] == 'true' ||
                   aItens[i][3][1] == 'true' ){
                    cQry += " INSERT INTO DbFabrica.dbo.ADM_ACESSOS ( ID_USER, ID_MODULO, ADICIONAR, ALTERAR, REMOVER ) VALUES ( " 
                    cQry +=        nUser           + ", " 
                    cQry +=        aItens[i][4][0] + ", "
                    if(aItens[i][1][1] == 'true'){ cQry += 1 + ", " } else { cQry += 0 + ", " }
                    if(aItens[i][2][1] == 'true'){ cQry += 1 + ", " } else { cQry += 0 + ", " }
                    if(aItens[i][3][1] == 'true'){ cQry += 1 + ") " } else { cQry += 0 + ") " }
                }
            }

            conn.request().query(" DELETE FROM DbFabrica.dbo.ADM_ACESSOS WHERE ID_USER = " + nUser).then(result =>  {
                aOK = []
                conn.request().query(cQry).then(result =>  {
                    aOK.push( { OK: 'S' })  
                    res.json(aOK)
                }).catch(erro => {
                    aOK = []
                    console.log(erro)
                    aOK.push( { OK: 'N' })
                    res.json(aOK)
                })
            }).catch(erro => {
                aOK = []
                console.log(erro)
                aOK.push( { OK: 'N' })
                res.json(aOK)
            })

        }
    })



module.exports = router;