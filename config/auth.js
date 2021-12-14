const localStrategy = require("passport-local").Strategy
const db            = require("../models/db")
const bcrypt        = require("bcryptjs")

// Model de Usuarios
require("../models/Usuarios")
const Post = require('../models/Usuarios');

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'Email', passwordField: "Senha"}, (email, senha, done) => {
        
        Post.Usuarios.findOne({ where: {EMAIL: email} }).then((usuario) => { 
            
            if(usuario.EMAIL != email){
                return done(null, false, {message: "Conta não encontrada"})
            }

            bcrypt.compare(senha, usuario.SENHA, (erro, ok) => {
                if(ok){
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        }).catch((err) => {
            return done(null, false, {message: "Conta não encontrada"})
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Post.Usuarios.findByPk(id).then(usuario => {
/*
            var cQry =  ""

            cQry +=  " SELECT                                                                   "
            cQry +=  "    USU.id ID                                                             "       
            cQry +=  "    ,ISNULL(MOD.ID, '') ID_MOD                                            "
            cQry +=  "    ,ISNULL(MOD.TIPO,'') TIPO                                             "
            cQry +=  "    ,ISNULL(MOD.MODULO,'') MODULO                                         "
            cQry +=  "    ,ISNULL(MOD.ROTINA, '') ROTINA                                        "
            cQry +=  "    ,MOD.RELATORIO                                                        "
            cQry +=  "    ,CASE WHEN ACE.ID_USER IS NULL THEN 2 ELSE 1 END VISUALIZAR           "
            cQry +=  "    ,ACE.ADICIONAR                                                        "
            cQry +=  "    ,ACE.ALTERAR                                                          "
            cQry +=  "    ,ACE.REMOVER                                                          "
            cQry +=  "    ,USU.EMPPADRAO                                                        "
            cQry +=  "    ,EMP.GRUPO EMPRESA                                                    "
            cQry +=  "    ,EMP.Codigo FILIAL                                                    "
            cQry +=  " FROM                                                                     "       
            cQry +=  "    Usuarios USU   	                                                    "
            cQry +=  "    INNER JOIN ADM_ACESSOS (NOLOCK) ACE ON                                "
            cQry +=  "      USU.id = ACE.ID_USER                                                "
            cQry +=  "    INNER JOIN ADM_MODULOS (NOLOCK) MOD ON                                "
            cQry +=  "      ACE.ID_MODULO = MOD.ID                                              "
            cQry +=  "    INNER JOIN Empresas (NOLOCK) EMP ON                                   "
            cQry +=  "      USU.EMPPADRAO = EMP.id                                              "
            cQry +=  " WHERE                                                                    "         
            cQry +=  "    USU.id = '" + id + "'                                                 "
            cQry +=  "    AND USU.STATUS = 1                                                    "
            cQry +=  "    AND MOD.STATUS = 1                                                    "
            cQry +=  " ORDER BY                                                                 "         
            cQry +=  "    ISNULL(MOD.TIPO,'')                                                   "             
            conn.request().query(cQry).then(dados => {
                usuario.Acessos = dados.recordset 

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

                conn.request().query(cQry).then(dados => {
                    usuario.Modulos = dados.recordset 
                    done(null, usuario)
                }).catch((err) => {
                    done(null, err)
                })
            }).catch((err) => {
                done(null, err)
            })
*/
            done(null, usuario)
        })
    })
}
