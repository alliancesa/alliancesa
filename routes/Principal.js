const express = require('express');
const router  = express.Router();
const db      = require("../models/db")
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
            var aLogin = req.user.Nome
            nBemVindo++
        }

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
            } else if(req.user.PRINCIPAL == '3') {    
                res.render("Principal/Gerencial3", {
                    aAdminMenu: aAdminMenu 
                    ,aMenu 
                    ,aModulo
                    ,aRotina
                    ,aLogin
                })
            } else if(req.user.PRINCIPAL == '4') {    
                res.render("TI/Analises/index", {
                    aTI: aMenu
                    ,aMenu 
                    ,aModulo
                    ,aRotina
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
        } else if(req.user.PRINCIPAL == '3') {         
            res.render("Principal/Gerencial3", {
                aMenu 
                ,aModulo
                ,aRotina
                ,aLogin
            })  
        } else if(req.user.PRINCIPAL == '4') {    
            res.render("TI/Analises/index", {
                aTI: aMenu
            })          
        } else {
            if(req.user.VENDEDOR == '' || req.user.VENDEDOR == null){ 
                res.render("Principal/index", {
                    aMenu 
                    ,aModulo
                    ,aRotina
                    ,aLogin
                })
            } else {
                res.render("Vendedores/index", {
                    aMenuVendedor: "OK"
                    ,aLogin
                    ,aMenu 
                    ,aModulo
                    ,aRotina
                })
            }
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

        } else if(req.body.cParam1 == 2) {
            cQry  =  " SELECT                                                                                               "
            cQry +=  "    *                                                                                                 "
            cQry +=  " FROM                                                                                                 "
            cQry +=  "    vwFAT002_V2                                                                                       "
            cQry +=  " WHERE                                                                                                "
            cQry +=  "    VALBRUT > 0                                                                                       "
            cQry += "     AND EMPRESA+FILIAL = '" + req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] +"'     "
        } else if(req.body.cParam1 == 3) {
            cQry  = " EXEC procFatVSComp_Etapa_1 '" + req.body.cParam2                +  "'                                 "
            cQry += "                            ,'" + req.body.cParam3.split("_")[0] +  "'                                 "
            cQry += "                            ,'" + req.body.cParam3.split("_")[1] +  "'                                 "
            cQry += "                            ,'2'                                                                       "
        } else if(req.body.cParam1 == 4) { 
            cQry   =   " SELECT                                                                                             "
            cQry  +=   "    FORMAT(SUM(CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END), 'N', 'PT-BR') FAT_MES          "
            cQry  +=   "    ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN CASE WHEN CAST(EMISSAO AS DATE) =                         "
            cQry  +=   "        CAST(GETDATE() AS DATE) THEN VALBRUT ELSE 0 END ELSE CASE WHEN CAST(EMISSAO AS DATE) =      "
            cQry  +=   "        CAST(GETDATE() AS DATE) THEN -VALBRUT ELSE 0 END END), 'N', 'PT-BR') FAT_DIA                "
            cQry  +=   "    ,ROUND(AVG(PRAZO),0) PRAZO                                                                      "

            if(req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] != "02050101"){
                cQry  +=   "    ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END) / SUM(CASE WHEN TIPO = 'F'     "
                cQry  +=   "        THEN PBRUTO ELSE -PBRUTO END), 'N', 'PT-BR') PRECO                                          "
            } else {
                cQry  +=   "    ,0 PRECO                                                                                        "
            }
            
            cQry  +=  "     ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ), 'N', 'PT-BR') PBRUTO           " 
            cQry  +=  " FROM                                                                                                "
            cQry  +=  "   (                                                                                                 "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "        *                                                                                            "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "  	    vwFatEmpresas_V3                                                                            "
            cQry  +=  "    WHERE                                                                                            "
            cQry += "          EMPRESA+FILIAL = '" + req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] +"'    "
            cQry  +=  "        AND SUBSTRING(EMISSAO,1,6) = '" + req.body.cParam2 + "'                                      "
            cQry  +=  " )TRB                                                                                                "
        } else if(req.body.cParam1 == 5) {
            cQry  =  " EXEC ProcMATPrecoQtdPP_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                             "
            cQry +=  "                                ,'" + req.body.cParam2.split("_")[1] + "'                             "
        } else if(req.body.cParam1 == 6) {
            cQry   =  " SELECT * FROM  vwPrecoMed6MesMATPP ORDER BY MES2                                                    "
        } else if(req.body.cParam1 == 7) {
            cQry   =  " SELECT                                                                                              "
            cQry  +=  "    SUM(PAGAMENTOS) PAGAMENTOS                                                                       "
            cQry  +=  "    ,FORMAT(SUM(PAGAMENTOS) , 'n', 'PT-BR') PAGAMENTOS2                                              "
            cQry  +=  "    ,SUM(RECEBIDO) RECEBIDO                                                                          "
            cQry  +=  "    ,FORMAT(SUM(RECEBIDO) , 'n', 'PT-BR') RECEBIDO2                                                  "
            cQry  +=  "    ,SUM(RECEBIDO)-SUM(PAGAMENTOS) DIF                                                               "
            cQry  +=  "    ,FORMAT(SUM(RECEBIDO)-SUM(PAGAMENTOS), 'n', 'PT-BR') DIF2                                        "
            cQry  +=  " FROM                                                                                                "
            cQry  +=  "    (	                                                                                            "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "       PAGAMENTOS                                                                                    "
            cQry  +=  "       ,0 RECEBIDO                                                                                   "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "       vwPagTotalMes                                                                                 "
            cQry  +=  "    UNION ALL                                                                                        "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "       0                                                                                             "
            cQry  +=  "       ,RECEBIDO                                                                                     "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "       vwRecTotalMes                                                                                 "
            cQry  +=  " )TRB                                                                                                "
        } else if(req.body.cParam1 == 8) {
            cQry  =  " EXEC ProcMATPrecoQtdPE_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                             "
            cQry +=  "                                ,'" + req.body.cParam2.split("_")[1] + "'                             "
        } else if(req.body.cParam1 == 9) {
            cQry   =  " SELECT * FROM vwPrecoMed6MesMATCO ORDER BY MES2                                                     "
        } else if(req.body.cParam1 == 10) {
            cQry  =  " EXEC ProcMATPrecoQtd_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                               "
            cQry +=  "                              ,'" + req.body.cParam2.split("_")[1] + "'                               "
        } else if(req.body.cParam1 == 11) {
            cQry  = " SELECT                                                                                                "
            cQry += "    *                                                                                                  "
            cQry += " FROM                                                                                                  "
            cQry += "    vwFAT003_V2 (NOLOCK)                                                                               "
            cQry += " WHERE                                                                                                 "
            cQry += "     EMPRESA+FILIAL = '" + req.body.cParam2.split("_")[0] + req.body.cParam2.split("_")[1] +"'         "
            cQry +=  " ORDER BY                                                                                             "
            cQry +=  "    ANO2, MES2                                                                                        "    
        } else if(req.body.cParam1 == 12) {
            cQry  =  " EXEC ProcMATConComp_Etapa_1   '" + req.body.cParam2.split("_")[0] + "'                               "
            cQry +=  "                              ,'" + req.body.cParam2.split("_")[1] + "'                               "   
        }

        BuscaDados(cQry, res)
    })


    router.get('/Gerencial2', AuthUsuarios, (req, res) => {
        if(req.user.Admin == 1) {
            res.render("Principal/Gerencial2", {
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
    
    router.post("/Gerencial2",  function (req, res) {
        if(req.body.cParam1 == 1) { 
            cQry  = " SELECT                                                                                                        " 
            cQry += "     FILIAL                                                                                                    "                                                              
            cQry += "     ,SUM(VALBRUT_DIA) VALBRUT_DIA                                                                             "                                                           
            cQry += "     ,SUM(VALBRUT_MES) VALBRUT_MES                                                                             "
            cQry += "     ,SUM(VALBRUT_ANO) VALBRUT_ANO                                                                             "
            cQry += "     ,CASE WHEN SUM(VALBRUT_DIA) = 0 OR SUM(PBRUTO_DIA) = 0 THEN 0 ELSE SUM(VALBRUT_DIA)/                      "
            cQry += "           SUM(PBRUTO_DIA) END  PRCMED_DIA                                                                     "
            cQry += "     ,CASE WHEN SUM(VALBRUT_MES) = 0 OR SUM(PBRUTO_MES) = 0 THEN 0 ELSE SUM(VALBRUT_MES)/                      "
            cQry += "           SUM(PBRUTO_MES) END  PRCMED_MES                                                                     "
            cQry += "     ,CASE WHEN SUM(VALBRUT_ANO) = 0 OR SUM(PBRUTO_ANO) = 0 THEN 0 ELSE SUM(VALBRUT_ANO)/                      "
            cQry += "           SUM(PBRUTO_ANO) END  PRCMED_ANO                                                                     "
            cQry += "     ,SUM(PESO_RESIDUO_DIA) PESO_RESIDUO_DIA                                                                   " 
            cQry += "     ,SUM(PESO_RESIDUO_MES) PESO_RESIDUO_MES                                                                   "
            cQry += "     ,SUM(PESO_RESIDUO_ANO) PESO_RESIDUO_ANO                                                                   "
            cQry += "     ,CASE WHEN SUM(PBRUTO_DIA) = 0 THEN 0 ELSE SUM(PBRUTO_DIA)/1000 END PBRUTO_DIA                            "
            cQry += "     ,CASE WHEN SUM(PBRUTO_MES) = 0 THEN 0 ELSE SUM(PBRUTO_MES)/1000 END PBRUTO_MES                            "
            cQry += "     ,CASE WHEN SUM(PBRUTO_ANO) = 0 THEN 0 ELSE SUM(PBRUTO_ANO)/1000 END PBRUTO_ANO                            "
            cQry += "     ,SUM(VALBRUT_MES) VALBRUT_GRUPO_MES                                                                       "
            cQry += "     ,CASE WHEN SUM(PBRUTO_MES) = 0 THEN 0 ELSE SUM(PBRUTO_MES) END PBRUTO_GRUPO_MES                           "
            cQry += "     ,SUM(PESO_RESIDUO_MES) PESO_RESIDUO_GRUPO_MES                                                             "
            cQry += "     ,SUM(VALBRUT_ANO) VALBRUT_GRUPO_ANO                                                                       "
            cQry += "     ,CASE WHEN SUM(PBRUTO_ANO) = 0 THEN 0 ELSE SUM(PBRUTO_ANO) END PBRUTO_GRUPO_ANO                           "
            cQry += "     ,SUM(PESO_RESIDUO_ANO) PESO_RESIDUO_GRUPO_ANO                                                             "
            cQry += " FROM                                                                                                          "
            cQry += "     (                                                                                                         "
            cQry += "       SELECT                                                                                                  "
            cQry += "           EMPRESA+FILIAL FILIAL                                                                               "
            cQry += "           ,CASE WHEN EMISSAO = FORMAT(GETDATE(), 'yyyyMMdd') THEN CASE WHEN                                   "
            cQry += "           TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END ELSE 0 END VALBRUT_DIA                                    "
            cQry += "           ,CASE WHEN SUBSTRING(EMISSAO,1,6) = FORMAT(GETDATE(), 'yyyyMM') THEN                                "
            cQry += "               CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END ELSE 0 END VALBRUT_MES                      "
            cQry += "           ,CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END VALBRUT_ANO                                    "
            cQry += "           ,CASE WHEN EMISSAO = FORMAT(GETDATE(), 'yyyyMMdd') THEN CASE WHEN TIPO = 'F'                        "
            cQry += "               THEN PBRUTO ELSE -PBRUTO END ELSE 0 END PBRUTO_DIA                                              "
            cQry += "           ,CASE WHEN SUBSTRING(EMISSAO,1,6) = FORMAT(GETDATE(), 'yyyyMM') THEN CASE WHEN                      "
            cQry += "               TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ELSE 0 END PBRUTO_MES                                   "
            cQry += "           ,CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END PBRUTO_ANO                                       "
            cQry += "           ,CASE WHEN EMISSAO = FORMAT(GETDATE(), 'yyyyMMdd') THEN CASE WHEN BM_TIPGRU = 'KA'                  "
            cQry += "               THEN CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ELSE 0 END ELSE 0 END PESO_RESIDUO_DIA   "     
            cQry += "           ,CASE WHEN SUBSTRING(EMISSAO,1,6) = FORMAT(GETDATE(), 'yyyyMM') THEN CASE WHEN BM_TIPGRU = 'KA'     "
            cQry += "               THEN CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ELSE 0 END ELSE 0 END PESO_RESIDUO_MES   "
            cQry += "           ,CASE WHEN BM_TIPGRU = 'KA' THEN CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ELSE 0           "
            cQry += "               END PESO_RESIDUO_ANO                                                                            "
            cQry += "       FROM                                                                                                    "
            cQry += "           vwFatEmpresas_V3                                                                                    "
            cQry += "       WHERE                                                                                                   "
            cQry += "           YEAR(EMISSAO) = YEAR(GETDATE())                                                                     "
            cQry += " )TRB                                                                                                          "
            cQry += " GROUP BY                                                                                                      "
            cQry += "     FILIAL                                                                                                    "      
        } else if(req.body.cParam1 == 2) { 
            cQry  = " SELECT                                                                                                        "
            cQry += "     EMPGRUPO+FILIAL FILIAL                                                                                    "
            cQry += "     ,VALORES2                                                                                                 "
            cQry += " FROM                                                                                                          "
            cQry += "     vwMATPrecoQtd_V2 (NOLOCK)                                                                                 "
        } else if(req.body.cParam1 == 3) { 
            cQry  = " SELECT                                                                                                        "
            cQry += "    FILIAL                                                                                                     "
            cQry += "    ,DESCRICAO                                                                                                 "
            cQry += "    ,CASE WHEN SUM(PBRUTO) <> 0 THEN SUM(VALBRUT)/SUM(PBRUTO) ELSE 0 END PRCKG                                 "
            cQry += " FROM                                                                                                          "
            cQry += "    (	                                                                                                        "
            cQry += "     SELECT                                                                                                    "
            cQry += "         EMPRESA+FILIAL FILIAL                                                                                 "
            cQry += "        ,FAMILIA DESCRICAO                                                                                     "
            cQry += "        ,SUM(CASE WHEN TIPO = 'F' THEN PBRUTO  ELSE -PBRUTO  END) PBRUTO                                       "
            cQry += "        ,SUM(CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END) VALBRUT                                      "
            cQry += "        ,AVG(PRAZO) PRAZO                                                                                      "
            cQry += "     FROM                                                                                                      "
            cQry += "        (                                                                                                      "
            cQry += "         SELECT                                                                                                "
            cQry += "             *                                                                                                 "
            cQry += "         FROM                                                                                                  "
            cQry += "            vwFatEmpresas_V3                                                                                   "
            cQry += "         WHERE                                                                                                 "
            cQry += "            SUBSTRING(EMISSAO,1,6) = FORMAT(GETDATE(), 'yyyyMM')                                               "
            cQry += "     )TRB                                                                                                      "
            cQry += "     GROUP BY                                                                                                  "
            cQry += "        EMPRESA+FILIAL                                                                                         "
            cQry += "       ,FAMILIA                                                                                                "
            cQry += " )TRB                                                                                                          "
            cQry += "    GROUP BY                                                                                                   "
            cQry += "    FILIAL                                                                                                     "
            cQry += "    ,DESCRICAO                                                                                                 " 
            cQry += " ORDER BY                                                                                                      "       
            cQry += "    FILIAL                                                                                                     "
            cQry += "    ,DESCRICAO                                                                                                 "
        }

        BuscaDados(cQry, res)
    })

    router.get('/Gerencial3', AuthUsuarios, (req, res) => {
        if(req.user.Admin == 1) {
            res.render("Principal/Gerencial3", {
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
    
    router.post('/Gerencial3', AuthUsuarios, function(req, res){   
        if(req.body.cParam1 == 1) { // Faturamento - MIL R$
            cQry  = " SELECT                                                                                                "
            cQry += "    *                                                                                                  "
            cQry += " FROM                                                                                                  "
            cQry += "    vwFAT001_V2                                                                                        "
            cQry +=  " WHERE                                                                                                "
            cQry += "     EMPRESA+FILIAL = '" + req.body.cParam2.split("_")[0] + req.body.cParam2.split("_")[1] +"'         "

        } else if(req.body.cParam1 == 2) {
            cQry  =  " SELECT                                                                                               "
            cQry +=  "    *                                                                                                 "
            cQry +=  " FROM                                                                                                 "
            cQry +=  "    vwFAT002_V2                                                                                       "
            cQry +=  " WHERE                                                                                                "
            cQry +=  "    VALBRUT > 0                                                                                       "
            cQry += "     AND EMPRESA+FILIAL = '" + req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] +"'     "
        } else if(req.body.cParam1 == 3) {
            cQry  = " EXEC procFatVSComp_Etapa_1 '" + req.body.cParam2                +  "'                                 "
            cQry += "                            ,'" + req.body.cParam3.split("_")[0] +  "'                                 "
            cQry += "                            ,'" + req.body.cParam3.split("_")[1] +  "'                                 "
            cQry += "                            ,'2'                                                                       "
        } else if(req.body.cParam1 == 4) { 
            cQry   =   " SELECT                                                                                             "
            cQry  +=   "    FORMAT(SUM(CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END), 'N', 'PT-BR') FAT_MES          "
            cQry  +=   "    ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN CASE WHEN CAST(EMISSAO AS DATE) =                         "
            cQry  +=   "        CAST(GETDATE() AS DATE) THEN VALBRUT ELSE 0 END ELSE CASE WHEN CAST(EMISSAO AS DATE) =      "
            cQry  +=   "        CAST(GETDATE() AS DATE) THEN -VALBRUT ELSE 0 END END), 'N', 'PT-BR') FAT_DIA                "
            cQry  +=   "    ,ROUND(AVG(PRAZO),0) PRAZO                                                                      "

            if(req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] != "02050101"){
                cQry  +=   "    ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN VALBRUT ELSE -VALBRUT END) / SUM(CASE WHEN TIPO = 'F'     "
                cQry  +=   "        THEN PBRUTO ELSE -PBRUTO END), 'N', 'PT-BR') PRECO                                          "
            } else {
                cQry  +=   "    ,0 PRECO                                                                                        "
            }
            
            cQry  +=  "     ,FORMAT(SUM(CASE WHEN TIPO = 'F' THEN PBRUTO ELSE -PBRUTO END ), 'N', 'PT-BR') PBRUTO           " 
            cQry  +=  " FROM                                                                                                "
            cQry  +=  "   (                                                                                                 "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "        *                                                                                            "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "  	    vwFatEmpresas_V3                                                                            "
            cQry  +=  "    WHERE                                                                                            "
            cQry += "          EMPRESA+FILIAL = '" + req.body.cParam3.split("_")[0] + req.body.cParam3.split("_")[1] +"'    "
            cQry  +=  "        AND SUBSTRING(EMISSAO,1,6) = '" + req.body.cParam2 + "'                                      "
            cQry  +=  " )TRB                                                                                                "
        } else if(req.body.cParam1 == 5) {
            cQry  =  " EXEC ProcMATPrecoQtdPP_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                             "
            cQry +=  "                                ,'" + req.body.cParam2.split("_")[1] + "'                             "
        } else if(req.body.cParam1 == 6) {
            cQry   =  " SELECT * FROM  vwPrecoMed6MesMATPP ORDER BY MES2                                                    "
        } else if(req.body.cParam1 == 7) {
            cQry   =  " SELECT                                                                                              "
            cQry  +=  "    SUM(PAGAMENTOS) PAGAMENTOS                                                                       "
            cQry  +=  "    ,FORMAT(SUM(PAGAMENTOS) , 'n', 'PT-BR') PAGAMENTOS2                                              "
            cQry  +=  "    ,SUM(RECEBIDO) RECEBIDO                                                                          "
            cQry  +=  "    ,FORMAT(SUM(RECEBIDO) , 'n', 'PT-BR') RECEBIDO2                                                  "
            cQry  +=  "    ,SUM(RECEBIDO)-SUM(PAGAMENTOS) DIF                                                               "
            cQry  +=  "    ,FORMAT(SUM(RECEBIDO)-SUM(PAGAMENTOS), 'n', 'PT-BR') DIF2                                        "
            cQry  +=  " FROM                                                                                                "
            cQry  +=  "    (	                                                                                            "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "       PAGAMENTOS                                                                                    "
            cQry  +=  "       ,0 RECEBIDO                                                                                   "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "       vwPagTotalMes                                                                                 "
            cQry  +=  "    UNION ALL                                                                                        "
            cQry  +=  "    SELECT                                                                                           "
            cQry  +=  "       0                                                                                             "
            cQry  +=  "       ,RECEBIDO                                                                                     "
            cQry  +=  "    FROM                                                                                             "
            cQry  +=  "       vwRecTotalMes                                                                                 "
            cQry  +=  " )TRB                                                                                                "
        } else if(req.body.cParam1 == 8) {
            cQry  =  " EXEC ProcMATPrecoQtdPE_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                             "
            cQry +=  "                                ,'" + req.body.cParam2.split("_")[1] + "'                             "
        } else if(req.body.cParam1 == 9) {
            cQry   =  " SELECT * FROM vwPrecoMed6MesMATCO ORDER BY MES2                                                     "
        } else if(req.body.cParam1 == 10) {
            cQry  =  " EXEC ProcMATPrecoQtd_Etapa_1  '" + req.body.cParam2.split("_")[0] + "'                               "
            cQry +=  "                              ,'" + req.body.cParam2.split("_")[1] + "'                               "
        } else if(req.body.cParam1 == 11) {
            cQry  = " SELECT                                                                                                "
            cQry += "    *                                                                                                  "
            cQry += " FROM                                                                                                  "
            cQry += "    vwFAT003_V2 (NOLOCK)                                                                               "
            cQry += " WHERE                                                                                                 "
            cQry += "     EMPRESA+FILIAL = '" + req.body.cParam2.split("_")[0] + req.body.cParam2.split("_")[1] +"'         "
            cQry +=  " ORDER BY                                                                                             "
            cQry +=  "    ANO2, MES2                                                                                        "    
        } else if(req.body.cParam1 == 12) {
            cQry  =  " EXEC ProcMATConComp_Etapa_1   '" + req.body.cParam2.split("_")[0] + "'                               "
            cQry +=  "                              ,'" + req.body.cParam2.split("_")[1] + "'                               "   
        }

        BuscaDados(cQry, res)
    })
    

    router.get("/Vendedores/PreVendaInc", AuthUsuarios, function (req, res) {     
        res.render("Vendedores/PreVendaInc", {
            aMenuVendedor: aMenu
            ,aMenu 
            ,aModulo
            ,aRotina
        })
    })

    router.post("/Vendedores/PreVendaInc", AuthUsuarios, function (req, res) {  
        if(req.body.cParam1 == 1) {
            cQry  = " SELECT                                    "
            cQry += "    *                                      "
            cQry += " FROM                                      "
            cQry += "    vwClientes                             "   
            cQry += " WHERE                                     "
            cQry += "    VENDEDOR = '" + req.user.VENDEDOR + "' "
        } else if(req.body.cParam1 == 2) {
            cQry  = " SELECT                        "
            cQry += "    *                          " 
            cQry += " FROM                          "
            cQry += "    vwCondicaoPagto            "
        } else if(req.body.cParam1 == 3) {
            cQry  = " SELECT                        "
            cQry += "    *                          " 
            cQry += " FROM                          "
            cQry += "    vwTransportadoras          "
        } else if(req.body.cParam1 == 4) {
            cQry  = " SELECT                        "
            cQry += "    *                          " 
            cQry += " FROM                          "
            cQry += "    vwProdutos                 "
            cQry += " WHERE                         "
            cQry += "    STATUS = 'OK'              "
            cQry += " ORDER BY                      "
            cQry += "    PRODUTO                    "
        } else if(req.body.cParam1 == "5") {
            if(req.body.cParam2 == 1) {
                cQry  = " SELECT                                             "
                cQry += "    *                                               "
                cQry += " FROM                                               "
                cQry += "    vwClientes                                      "
                cQry += " WHERE                                              "
                cQry += "    VENDEDOR = '000128'                             "
                cQry += "    AND CODIGO = '" + req.body.cParam3 + "'         "
                cQry += "    AND LOJA   = '" + req.body.cParam4 + "'         "
            } else if(req.body.cParam2 == 2) {
                cQry  = " SELECT                                             "
                cQry += "    *                                               " 
                cQry += " FROM                                               "
                cQry += "    vwCondicaoPagto                                 "
                cQry += " WHERE                                              "
                cQry += "    CODIGO = '" + req.body.cParam3 + "'             "
            } else if(req.body.cParam2 == 3) {
                cQry  = " SELECT                                             "
                cQry += "    *                                               " 
                cQry += " FROM                                               "
                cQry += "    vwTransportadoras                               "
                cQry += " WHERE                                              "
                cQry += "    CODIGO = '" + req.body.cParam3 + "'             "
            } else if(req.body.cParam2 == 4) {
                cQry  = " SELECT                                             "
                cQry += "    *                                               " 
                cQry += " FROM                                               "
                cQry += "    vwProdutos                                      "
                cQry += " WHERE                                              "
                cQry += "    STATUS = 'OK'                                   "
                cQry += "    AND PRODUTO = '" + req.body.cParam3 + "'        "
            }
        } else if(req.body.cParam1 == "6") {
            var aDados = []
            var aDados2 = []
            var lOK = true
            var nX = 0
            Object.keys(req.body).forEach(function(item){
                nX += 1
                var aItens = []

                if(item.substring(0,9) == "cProduto_") {
                    aDados.push([ item.substring(13,9)])
                    aItens.push(req.body[item])
                } else if(item.substring(0, 7) == "nQuant_"){ 
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 7) == "nPreco_"){
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 7) == "nTotal_"){
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 9) == "cEntrega_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 5) == "cObs_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 5) == "cPed_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 9) == "cItemPed_"){
                    aItens.push(req.body[item])
                } 

                if(aItens.length > 0){
                    aDados.push(aItens[0])
                }

                if(lOK){
                    if(nX == 16) {
                        aDados2.push(aDados)
                        aDados = []
                        nX = 0    
                        lOK = false                   
                    }
                } else{
                    if(nX == 7) {
                        aDados2.push(aDados)
                        aDados = []
                        nX = 0
                    }
                }
            });

            if(req.body.nFrete == ''){
                req.body.nFrete = '0,00'
            }           

            cQry  = " INSERT INTO PREVENDASC5                     " 
            cQry += "  (	EMPRESA                               "     //00
            cQry += "   	,C5_FILIAL                            "     //01
            cQry += "   	,C5_EMISSAO                           "     //02
            cQry += "   	,C5_PRC_VAL                           "     //03
            cQry += "   	,C5_CLIENTE                           "     //04
            cQry += "   	,C5_LOJACLI                           "     //05
            cQry += "   	,C5_CONDPAG                           "     //06
            cQry += "   	,C5_VEND1                             "     //07
            cQry += "   	,C5_TPFRETE                           "     //08
            cQry += "   	,C5_FRETE                             "     //09
            cQry += "   	,C5_REDESP                            "     //10
            cQry += "   	,C5_STATUSP                           "     //11
            cQry += "   	,C5_TIPO                              "     //12
            cQry += "   	,C5_PRC_NUS                           "     //13
            cQry += " )                                           "
            cQry += " VALUES                                      "
            cQry += " ( 	'01'                                  "     //00
            cQry += "   	,'01'                                 "     //01
            cQry += "    	,'" + req.body.cData2.substr(6,4)+req.body.cData2.substr(3,2)+req.body.cData2.substr(0,2)           +   "'       "    //02
            cQry += "   	,'" + req.body.cDataVal2.substr(6,4)+req.body.cDataVal2.substr(3,2)+req.body.cDataVal2.substr(0,2)  +   "'       "    //03
            cQry += "   	,'" + req.body.cCliente   +   "'      "     //04
            cQry += "   	,'" + req.body.cLoja      +   "'      "     //05
            cQry += "   	,'" + req.body.cCondPgto  +   "'      "     //06
            cQry += "   	,'" + req.user.VENDEDOR   +   "'      "     //07
            cQry += "   	,'" + req.body.cTipoFrete +   "'      "     //08
            cQry += "   	,"  + parseFloat(req.body.nFrete.replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", "."))    //09
            cQry += "   	,'" + req.body.cRespa     +   "'      "     //10
            cQry += "   	,'V'                                  "     //11
            cQry += "   	,'N'                                  "     //12
            cQry += "   	,'" + req.user.Nome + "'              "     //13
            cQry += " )                                           "
            
            conn.request().query(cQry).then(dados => { 
                
                cQry  = " SELECT                "
                cQry += "    ID                 "
                cQry += " FROM                  "
                cQry += "    PREVENDASC5        "
                cQry += " ORDER BY              "
                cQry += "    ID DESC            "

                conn.request().query(cQry).then(dados2 => { 
                    var cID = dados2.recordset[0].ID

                    for (let i = 0; i < aDados2.length; i++) {
                        cQry  = " INSERT INTO PREVENDASC6                     " 
                        cQry += "  (	EMPRESA                               "     //00
                        cQry += "   	,C6_FILIAL                            "     //01
                        cQry += "   	,SC6_ID                               "     //02
                        cQry += "   	,C6_ITEM                              "     //03
                        cQry += "   	,C6_PRODUTO                           "     //04
                        cQry += "   	,C6_QTDVEN                            "     //05
                        cQry += "   	,C6_PRCVEN                            "     //06
                        cQry += "   	,C6_VALOR                             "     //07
                        cQry += "   	,C6_ENTREG                            "     //08
                        cQry += "   	,C6_PRC_OBS                           "     //09
                        cQry += "   	,C6_PEDCOM                            "     //10
                        cQry += "   	,C6_ITP                               "     //11
                        cQry += " )                                           "
                        cQry += " VALUES                                      "
                        cQry += " ( 	'01'                                  "     //00
                        cQry += "   	,'01'                                 "     //01
                        cQry += "   	,"  + cID + "                         "     //02
                        cQry += "   	,'" + aDados2[i][0] + "'              "     //03
                        cQry += "   	,'" + aDados2[i][1] + "'              "     //04
                        cQry += "   	,"  + aDados2[i][2]                         //05
                        cQry += "   	,"  + aDados2[i][3]                         //06
                        cQry += "   	,"  + aDados2[i][2]*aDados2[i][3]           //07
                        cQry += "   	,'" + aDados2[i][4].substr(6,4)+aDados2[i][4].substr(3,2)+aDados2[i][4].substr(0,2)  + "'"     //08
                        cQry += "   	,'" + aDados2[i][5] + "'              "     //09
                        cQry += "   	,'" + aDados2[i][6] + "'              "     //10
                        cQry += "   	,'" + aDados2[i][7] + "'              "     //11
                        cQry += " )                                           "
                    
                        conn.request().query(cQry).then(dados3 => { 

                        }).catch(err => {
                            req.flash("error_msg", "Erro ao realizar ao gravar a Pré-Venda (03). " );
                            res.redirect(req.headers.referer);  
                            console.log(err)
                        });
                    }
                }).catch(err => {
                    req.flash("error_msg", "Erro ao realizar ao gravar a Pré-Venda. (02)" );
                    res.redirect(req.headers.referer);
                    console.log(err)
                });
            }).catch(err => {
                req.flash("error_msg", "Erro ao realizar ao gravar a Pré-Venda. (01)" );
                res.redirect(req.headers.referer);
                console.log(err)
            });
            req.flash("success_msg", "Pré-Venda gravada com sucesso!" );
            res.redirect(req.headers.referer);
        }
        
        if(req.body.cParam1 != "6"){
            BuscaDados(cQry, res)
        }
    })


    router.get("/Vendedores/PreVendaList", AuthUsuarios, function (req, res) {     
        res.render("Vendedores/PreVendaList", {
            aMenuVendedor: aMenu
            ,aMenu 
            ,aModulo
            ,aRotina
        })
    })

    router.post("/Vendedores/PreVendaList", AuthUsuarios, function (req, res) {  
        if(req.body.cParam1 == 1) {
            cQry  = " SELECT                                                            "
            cQry += "    SC5.ID                                                         "
            cQry += "    ,FORMAT(CAST(C5_EMISSAO AS DATE), 'd', 'PT-BR') DATA           " 
            cQry += "    ,FORMAT(CAST(C5_PRC_VAL AS DATE), 'd', 'PT-BR') VALIDADE       "
            cQry += "    ,ISNULL(C5_NUM,'') PEDIDO                                      "
            cQry += "    ,C5_CLIENTE CLIENTE                                            "
            cQry += "    ,C5_LOJACLI LOJA                                               "
            cQry += "    ,A1_NOME NOME                                                  "
            cQry += "    ,SUM(C6_VALOR) TOTAL                                           "
            cQry += "    ,FORMAT(SUM(C6_VALOR), 'C', 'PT-BR') TOTAL2                    "
            cQry += "    ,CASE WHEN C5_STATUSP = 'R'                     THEN 'R'       " 
            cQry += "          WHEN CAST(C5_PRC_VAL AS date) <                          "
            cQry += "       CAST(GETDATE() AS DATE) AND C5_STATUSP = 'V' THEN 'X'       "
            cQry += "          WHEN C5_STATUSP = 'V'					 THEN ''        "
            cQry += "          WHEN C5_NOTA IS NULL AND C5_NUM <> ''	 THEN 'A'       "
            cQry += "    ELSE 'E' END STATUS                                            "
            cQry += " FROM	                                                            "
            cQry += "    PREVENDASC5 SC5                                                "
            cQry += "    INNER JOIN PREVENDASC6 (NOLOCK) SC6 ON                         "
            cQry += "       SC5.ID = SC6.SC6_ID                                         "
            cQry += "    INNER JOIN DbProducao.dbo.SA1010 (NOLOCK) SA1 ON               "
            cQry += "       C5_CLIENTE = A1_COD                                         "
            cQry += "       AND C5_LOJACLI = A1_LOJA                                    "
            cQry += "       AND SA1.D_E_L_E_T_ <> '*'                                   "
            cQry += " WHERE                                                             "
            cQry += "    C5_VEND1 = '" + req.user.VENDEDOR + "'                         "
            cQry += " GROUP BY                                                          "
            cQry += "    SC5.ID                                                         "
            cQry += "    ,C5_EMISSAO                                                    "
            cQry += "    ,C5_PRC_VAL                                                    "
            cQry += "    ,C5_NUM                                                        "
            cQry += "    ,C5_CLIENTE                                                    "
            cQry += "    ,C5_LOJACLI                                                    "
            cQry += "    ,A1_NOME                                                       "
            cQry += "    ,C5_STATUSP                                                    "
            cQry += "    ,C5_NOTA                                                       "
        } else if(req.body.cParam1 == 2) {
            
            cQry  = " DELETE FROM PREVENDASC5 WHERE ID =     " + req.body.cParam2
            cQry += " DELETE FROM PREVENDASC6 WHERE SC6_ID = " + req.body.cParam2

            conn.request().query(cQry).then(dados => { 
            }).catch(err => {
                req.flash("error_msg", "Erro na tentativa de remoção do pedido!" );
                res.redirect(req.headers.referer);
                console.log(err)
            });
            req.flash("success_msg", "Pedido deletado com sucesso!" );
            res.redirect(req.headers.referer);
        }
        
        BuscaDados(cQry, res)
    })

    router.get("/Vendedores/PreVendaAlt/:ID", AuthUsuarios, function (req, res) {     
        cQry  = " SELECT                                                                   "
	    cQry += "    ID                                                                    "
        cQry += "    ,EMPRESA                                                              "
        cQry += "    ,C5_FILIAL                                                            "
        cQry += "    ,FORMAT(CAST(C5_EMISSAO AS date), 'd', 'PT-BR') C5_EMISSAO            "
        cQry += "    ,C5_TIPO                                                              "
        cQry += "    ,C5_NUM                                                               "
        cQry += "    ,C5_CLIENTE                                                           "
        cQry += "    ,C5_LOJACLI                                                           "
        cQry += "    ,A1_NOME                                                              "
        cQry += "    ,FORMAT(CAST(C5_PRC_VAL AS date), 'd', 'PT-BR') C5_PRC_VAL            "
        cQry += "    ,C5_CONDPAG                                                           "
        cQry += "    ,E4_DESCRI                                                            "
        cQry += "    ,C5_TPFRETE                                                           "
        cQry += "    ,CASE WHEN C5_TPFRETE = 'C' THEN 'CIF' ELSE 'FOB' END TPFRETE         "
        cQry += "    ,FORMAT(C5_FRETE, 'N', 'PT-BR') C5_FRETE                              "
        cQry += "    ,C5_REDESP                                                            "
        cQry += "    ,ISNULL(A4_NOME,'') A4_NOME                                           "
        cQry += " FROM                                                                     "
        cQry += "    PREVENDASC5                                                           "
        cQry += "    INNER JOIN DbProducao.dbo.SA1010 (NOLOCK) SA1 ON                      "
		cQry += "      C5_CLIENTE = A1_COD                                                 "
		cQry += "      AND C5_LOJACLI = A1_LOJA                                            "
		cQry += "      AND SA1.D_E_L_E_T_ <> '*'                                           "
        cQry += "    LEFT JOIN DbProducao.dbo.SA4010 (NOLOCK) SA4 ON                       "
		cQry += "      C5_REDESP = A4_COD                                                  "
		cQry += "      AND SA4.D_E_L_E_T_ <> '*'                                           "
        cQry += "    INNER JOIN DbProducao.dbo.SE4010 (NOLOCK) SE4 ON                      "
		cQry += "      C5_CONDPAG = E4_CODIGO                                              "
        cQry += "      AND SE4.D_E_L_E_T_ <> '*'                                           "
        cQry += " WHERE                                                                    "
        cQry += "    ID = " + req.params.ID                                                  
        
        cQry2  = " SELECT                                                                  "
        cQry2 += "    ID                                                                   "
        cQry2 += "    ,EMPRESA                                                             "
        cQry2 += "    ,SC6_ID                                                              "
        cQry2 += "    ,C6_FILIAL                                                           "
        cQry2 += "    ,C6_ITEM                                                             "
        cQry2 += "    ,C6_PRODUTO                                                          "
        cQry2 += "    ,B1_DESC DESCRICAO                                                   "
        cQry2 += "    ,B1_UM UM                                                            "
        cQry2 += "    ,FORMAT(C6_QTDVEN, 'n', 'PT-BR') C6_QTDVEN                           "
        cQry2 += "    ,FORMAT(C6_PRCVEN, 'n', 'PT-BR') C6_PRCVEN                           "
        cQry2 += "    ,FORMAT(C6_VALOR, 'n', 'PT-BR') C6_VALOR                             "
        cQry2 += "    ,C6_VALOR TOTAL                                                      "
        cQry2 += "    ,FORMAT(CAST(C6_ENTREG AS date), 'd', 'PT-BR') C6_ENTREG             "
        cQry2 += "    ,C6_PRC_OBS                                                          "
        cQry2 += "    ,C6_PEDCOM                                                           "
        cQry2 += "    ,C6_ITP                                                              "
        cQry2 += " FROM                                                                    "
        cQry2 += "    PREVENDASC6                                                          "
        cQry2 += "    INNER JOIN DbProducao.dbo.SB1010 (NOLOCK) SB1 ON                     "
		cQry2 += "      C6_FILIAL = B1_FILIAL                                              "
		cQry2 += "      AND C6_PRODUTO  = B1_COD                                           "
        cQry2 += "      AND SB1.D_E_L_E_T_ <> '*'                                          "
        cQry2 += " WHERE                                                                   "
        cQry2 += "    SC6_ID = " + req.params.ID

        
        conn.request().query(cQry).then(dados => { 
            var aSC5 = dados.recordset
            conn.request().query(cQry2).then(dados2 => { 
                var aSC6 = dados2.recordset
                
                res.render("Vendedores/PreVendaAlt", {
                    aMenuVendedor: aMenu
                    ,aSC5
                    ,aSC6
                })
            }).catch(err => {
                req.flash("error_msg", "Item não encontrado! (SC6)" );
                res.redirect(req.headers.referer);
                console.log(err)
            });    
        }).catch(err => {
            req.flash("error_msg", "Item não encontrado! (SC5)" );
            res.redirect(req.headers.referer);
            console.log(err)
        });
    })

    router.post("/Vendedores/PreVendaAlt", AuthUsuarios, function (req, res) {
        if(req.body.cParam1 == "1") {   
            var aDados = []
            var aDados2 = []
            var lOK = true
            var nX = 0
            Object.keys(req.body).forEach(function(item){
                nX += 1
                var aItens = []

                if(item.substring(0,9) == "cProduto_") {
                    aDados.push(item.substring(13,9))
                    aItens.push(req.body[item])
                } else if(item.substring(0, 7) == "nQuant_"){ 
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 7) == "nPreco_"){
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 7) == "nTotal_"){
                    aItens.push(parseFloat(req.body[item].replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", ".")))
                } else if(item.substring(0, 9) == "cEntrega_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 5) == "cObs_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 5) == "cPed_"){
                    aItens.push(req.body[item])
                } else if(item.substring(0, 9) == "cItemPed_"){
                    aItens.push(req.body[item])
                } 

                if(aItens.length > 0){
                    aDados.push(aItens[0])
                }

                if(lOK){
                    if(nX == 8) {
                        aDados2.push(aDados)
                        aDados = []
                        nX = 0    
                        lOK = false                   
                    }
                } else{
                    if(nX == 7) {
                        aDados2.push(aDados)
                        aDados = []
                        nX = 0
                    }
                }
            });

            cQry  = " UPDATE PREVENDASC5 SET C5_CLIENTE = '" +  req.body.cCliente + "'"
            cQry += "   ,C5_LOJACLI = '" + req.body.cLoja + "'"
            cQry += "   ,C5_CONDPAG = '" + req.body.cCondPgto + "'"
            cQry += "   ,C5_TPFRETE = '" + req.body.cTipoFrete + "'"
            cQry += "   ,C5_FRETE   =  " + parseFloat(req.body.nFrete.replace(".", "").replace(".", "").replace(".", "").replace(".", "").replace(",", "."))
            cQry += "   ,C5_REDESP  = '" + req.body.cRespa + "'"
            cQry += "   WHERE ID = " + req.body.cParam2

            conn.request().query(cQry).then(dados => { 
               
                cQry  = " DELETE FROM PREVENDASC6 WHERE SC6_ID = " + req.body.cParam2
    
                conn.request().query(cQry).then(dados2 => { 
                    for (let i = 1; i < aDados2.length; i++) {
                        cQry  = " INSERT INTO PREVENDASC6                     " 
                        cQry += "  (	EMPRESA                               "     //00
                        cQry += "   	,C6_FILIAL                            "     //01
                        cQry += "   	,SC6_ID                               "     //02
                        cQry += "   	,C6_ITEM                              "     //03
                        cQry += "   	,C6_PRODUTO                           "     //04
                        cQry += "   	,C6_QTDVEN                            "     //05
                        cQry += "   	,C6_PRCVEN                            "     //06
                        cQry += "   	,C6_VALOR                             "     //07
                        cQry += "   	,C6_ENTREG                            "     //08
                        cQry += "   	,C6_PRC_OBS                           "     //09
                        cQry += "   	,C6_PEDCOM                            "     //10
                        cQry += "   	,C6_ITP                               "     //11
                        cQry += " )                                           "
                        cQry += " VALUES                                      "
                        cQry += " ( 	'01'                                  "     //00
                        cQry += "   	,'01'                                 "     //01
                        cQry += "   	,"  + req.body.cParam2 + "            "     //02
                        cQry += "   	,'" + aDados2[i][0] + "'              "     //03
                        cQry += "   	,'" + aDados2[i][1] + "'              "     //04
                        cQry += "   	,"  + aDados2[i][2]                         //05
                        cQry += "   	,"  + aDados2[i][3]                         //06
                        cQry += "   	,"  + aDados2[i][2]*aDados2[i][3]           //07
                        cQry += "   	,'" + aDados2[i][4].substr(6,4)+aDados2[i][4].substr(3,2)+aDados2[i][4].substr(0,2)  + "'"     //08
                        cQry += "   	,'" + aDados2[i][5] + "'              "     //09
                        cQry += "   	,'" + aDados2[i][6] + "'              "     //10
                        cQry += "   	,'" + aDados2[i][7] + "'              "     //11
                        cQry += " )                                           "

                        conn.request().query(cQry).then(dados3 => { 

                        }).catch(err => {
                            req.flash("error_msg", "Item não encontrado! (SC6)" );
                            res.redirect(req.headers.referer);
                            console.log(err)
                        });
                    }
                }).catch(err => {
                    req.flash("error_msg", "Item não encontrado! (SC6.DELETE)" );
                    res.redirect(req.headers.referer);
                    console.log(err)
                });
            }).catch(err => {
                req.flash("error_msg", "Item não encontrado! (SC5)" );
                res.redirect(req.headers.referer);
                console.log(err)
            });
            req.flash("success_msg", "Pedido atualizado com sucesso!" );
            res.redirect(req.headers.referer);
        }

    })

                
    router.get("/Teste",  function (req, res) {
        var aDados = []
       
        const options = {
            url: "http://192.168.20.220/L"		
            ,headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                aDados = []
                //aArray = body.split("|")
                aArray = aArray = body.split(">")[1].split("|")

                for(i = 1; i < aArray.length; i++) {
                    
                    if(aArray[i].trim() != ''){
                        
                        var aItens = []
                        var cMaquina  = 'Tear ' + aArray[i].trim().split(";")[0].trim()
                        var cData     = aArray[i].trim().split(";")[1].trim().split("/")
                        var cHora     = aArray[i].trim().split(";")[2].trim().split("/")
                        var nPuxador  = parseFloat(aArray[i].trim().split(";")[3])
                        var nVelAnel  = parseFloat(aArray[i].trim().split(";")[4])
                        var nFalhas   = parseFloat(aArray[i].trim().split(";")[5])
        
                        var cDataOld = ''
                        var cHoraOld = ''
        
                        // Ajusta Data
                        if(cData[0].length == 1){
                            cDataOld = '0' + cData[0]
                        } else {
                            cDataOld = cData[0]
                        }
                        if(cData[1].length == 1){
                            cDataOld += '/0' + cData[1]
                        } else {
                            cDataOld += '/' + cData[1]
                        }
                        if(cData[2].length == 1){
                            cDataOld += '/0' + cData[2]
                        } else {
                            cDataOld += '/' + cData[2]
                        }
                        
                        //Ajusta hora
                        if(cHora[0].length == 1){
                            cHoraOld = '0' + cHora[0]
                        } else {
                            cHoraOld = cHora[0]
                        }
                        if(cHora[1].length == 1){
                            cHoraOld += ':0' + cHora[1]
                        } else {
                            cHoraOld += ':' + cHora[1]
                        }
                        if(cHora[2].length == 1){
                            cHoraOld += ':0' + cHora[2]
                        } else {
                            cHoraOld += ':' + cHora[2]
                        }
        
                        cData = cDataOld
                        cHora = cHoraOld
        
                        aItens.push(cMaquina)
                        aItens.push(cData)
                        aItens.push(cHora)
                        aItens.push(nPuxador)
                        aItens.push(nVelAnel)
                        aItens.push(nFalhas)

                        aDados.push(aItens)
                    } else {
                        console.log(i)
                        console.log(Array[i])
                    }
                    
                }    
                console.log(aDados)   
                
                
                
                res.send(aDados)         
            } else {
                console.log("Url não encontrada!")     
                res.send("Url não encontrada! - " + cHora)            
            }

        }
        
//        setInterval(() => {
            request(options, callback);    
//        }, 1000);
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