
const express    = require('express');
const router     = express.Router();
const db         = require("../models/db")
const Post       = require('../models/Usuarios');
const nodemailer = require('nodemailer');
const bcrypt     = require("bcryptjs")
const passport   = require("passport")
const crypto     = require('crypto');

//const ActiveDirectoryStrategy = require('passport-activedirectory')
const cMenu      = "OK"

const {Admin}    = require("../helpers/Admin")
const {AuthUsuarios}   = require("../helpers/Usuarios")
const {BuscaReal}   = require("../helpers/BuscaReal")

    // Variaveis Globais
    aMenu   = []
    aModulo = []
    aRotina = []

    // Enviar e-mail
    const transporter = nodemailer.createTransport({
        service: 'gmail'
        ,auth: {
            user: "alliancesa34@gmail.com",
            pass: "8pJyQxN!s"
        },
        tls: { rejectUnauthorized: false }
    });

    router.get('/', Admin, (req, res) => {
        Post.Usuarios.findAll().then(function(dados) {  
            for (i = 0; i < dados.length; i++){
                if(dados[i].Admin==1){
                    dados[i].Admin = 'Sim'
                } else {
                    dados[i].Admin = 'Não'
                }
            }    
            res.render("Usuarios/index", {
                aUsuarios: dados
                ,aUsuarioMenu: cMenu   
                ,aRotina
            })
        })
    })

   // busca tela para alterar cadastro de Usuarios
   router.get('/Edit', Admin, function(req, res){
        Post.Usuarios.findAll().then(function(dados) {  
            for (i = 0; i < dados.length; i++){
                if(dados[i].Admin==1){
                    dados[i].Admin = 'Sim'
                } else {
                    dados[i].Admin = 'Não'
                }
            }    
            res.render('Usuarios/Edit', { 
                aUsuarios: dados
                ,aUsuarioMenu: cMenu 
                ,aRotina
            })   
        })   
   })

   router.get('/Edit/:id', Admin, function(req, res){
        Post.Usuarios.findAll({
            where: {
                id: req.params.id
            }
        }).then(function(dados) {
            res.render('Usuarios/Edit', { 
                aUsuariosEdit: dados
                ,aUsuarioMenu: cMenu
                ,aRotina
            });     
        })   
    }) 

    router.post('/Edit', Admin, function (req, res) {
        // verifica os erros
        var erros = [];

        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome Inválido"})
        }

        if(req.body.senha != '' || req.body.senha2 != '') {

            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({texto: "Senha Inválida"})
            }

            if(req.body.senha.length < 4) {
                erros.push({texto: "Senha muito curta"})
            }

            if(req.body.senha!= req.body.senha2) {
                erros.push({texto: "As senhas não coferem, tente novamente"})
            }
        }

        // Valida erros e adiciona registro
        if(erros.length > 0) {
            Post.Usuarios.findAll({
                where: {
                    id: req.body.id
                }
            }).then(function(dados) {
                res.render("Usuarios/Edit", { 
                    erros: erros 
                    ,aUsuarioMenu: cMenu
                    ,aUsuarios: dados
                    ,aMenu
                    ,aRotina
                })
            })
        } else {
            if(req.body.Admin !=1 ){
                req.body.Admin = 0
            }
            if(req.body.senha != '') {
                const AlteraUsuario = ({
                    Nome: req.body.nome
                    ,Email: req.body.email
                    ,Senha: req.body.senha
                    ,Admin: req.body.Admin
                    ,UserERP: req.body.UserERP
                    ,VENDEDOR: req.body.Vendedor
                })
                
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(AlteraUsuario.Senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("erros_msg", "Houve um erro ao salvar o usuário")
                            res.redirect("/Usuarios/Edit")
                        }
                        AlteraUsuario.Senha = hash
                        Post.Usuarios.update(AlteraUsuario, { where: { id: req.body.id } })
                        .then(function() {
                            req.flash("success_msg", "Cadastro alterado com sucesso!");
                            res.redirect("/Usuarios/Edit");
                        }).catch(function (erro) {
                            req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                            res.redirect("/Usuarios/Edit");
                        })
    
                    })
                })
            } else {
                const AlteraUsuario = ({
                    Nome: req.body.nome
                    ,Email: req.body.email
                    ,Admin: req.body.Admin
                    ,UserERP: req.body.UserERP
                    ,VENDEDOR: req.body.Vendedor
                })

                Post.Usuarios.update(AlteraUsuario, { where: { id: req.body.id } })
                .then(function() {
                    req.flash("success_msg", "Cadastro alterado com sucesso!");
                    res.redirect("/Usuarios/Edit");
                }).catch(function (erro) {
                    req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                    res.redirect("/Usuarios/Edit");
                })
            }
        }
    })


    router.get('/Registrar', (req, res) => {
        res.render("Usuarios/Registro")
    })

    router.post("/Registrar", (req, res) => {
        var erros = []
      
        if(!req.body.discord || typeof req.body.discord  == undefined || req.body.discord == null){
            erros.push({texto: "ID discord Inválido"})
        }

        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail Inválido"})
        }

        if(!req.body.fone || typeof req.body.fone  == undefined || req.body.fone == null){
            erros.push({texto: "Fone Inválido"})
        }

        // Valida erros e adiciona registro
        if(erros.length > 0){
            req.flash("error_msg", "teste")
            res.render("Usuarios/Registro", {erros: erros})
        } else {
            //Post.Usuarios.findOne({EMAIL: req.body.email}).then((usuarios) => {
            Post.Usuarios.findAll({
                where: {
                    EMAIL: req.body.email
                }
            }).then(function(dados) {          
                if(dados.length > 0){
                    req.flash("error_msg", "Já existe um conta com esse e-mail")
                    res.redirect("Registro")
                } else {
                    var id = crypto.randomBytes(20).toString('hex');                    
                    var nRegra2 = 2

                    if(req.body.regra2 == "on"){
                        nRegra2 = 1
                    }

                    const NovoUsuario = new Post.Usuarios ({
                        DISCORD :  req.body.discord
                        ,EMAIL   :  req.body.email
                        ,FONE    :  req.body.fone
                        ,REGRA2  :  nRegra2
                        ,CHAVE   :  id
                        ,ADMIN   :  2
                        ,STATUS  :  2
                    })

                    NovoUsuario.save().then(() => {
                        req.flash("success_msg", "Você receberá um e-mail para validação de e-mail!")
                        res.redirect("Registrar")
                        EnviaEmail(req.body, id)

                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao criar o novo usuário, tente novamente")
                        res.redirect("Registrar")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("Registrar")
            })
        }
    })
    
    router.get("/ValidaEmail",  (req, res) => {
        res.render("Usuarios/ValidaEmail")
    })

    // Função para validação de email do usuário
    router.get("/ValidaEmail/:chave",  (req, res) => {
        Post.Usuarios.findAll({ where: { CHAVE: req.params.chave } } ).then((dados) => {   
            Post.Usuarios.findAll({ where: { Email: dados[0].EMAIL } } ).then((dados2) => {                
                if(dados.length > 0 && dados2.length > 0 && dados[0].STATUS == '2') {                
                    var id = crypto.randomBytes(20).toString('hex')
                    
                    const AlteraChave = ({
                        CHAVE   :  ""
                        ,CHAVE2 :  id
                    })
        
                    Post.Usuarios.update(AlteraChave, { where: { id: dados2[0].id } }).then(function() {
                        EnviaAdmin(dados2[0], id) 

                        res.render("Usuarios/ValidaEmail",{
                            aValidOK: "OK"
                        })
                    
                    }).catch(function (erro) {
                        req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                        res.redirect("ValidaEmail");
                    })
                } else {
                    res.render("Usuarios/ValidaEmail",{
                        aValidNC: "OK"
                        ,aRotina
                    })
                }
            })
        }).catch(function (erro) {
            res.render("Usuarios/ValidaEmail",{
                aValidNC: "OK"
            })
        })
    })


    // Função para liberação de cadastro por e-mail
    router.get("/APROVCAD",  (req, res) => {
        res.render("Usuarios/APROVCAD")
    })


    router.get("/APROVCAD/:chave",  (req, res) => {
        Post.Usuarios.findAll({ where: { CHAVE2: req.params.chave } } ).then((dados) => {   
            Post.Usuarios.findAll({ where: { Email: dados[0].EMAIL } } ).then((dados2) => {                
                if(dados.length > 0 && dados2.length > 0 && dados[0].STATUS == '2') {    
                    var id  = crypto.randomBytes(3).toString('hex');

                    const AlteraChave = ({
                        CHAVE2  : ""
                        ,STATUS : 1
                        ,SENHA  : id
                    })
        
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(AlteraChave.SENHA, salt, (erro, hash) => {
                            if(erro){
                                req.flash("erros_msg", "Houve um erro durante o salvamento do usuário")
                                res.redirect("Registrar")
                            }

                            AlteraChave.SENHA = hash
                            Post.Usuarios.update(AlteraChave, { where: { id: dados2[0].id } }).then(function() {
                                EnviaCadOK(dados2[0], id) 
        
                                res.render("Usuarios/APROVCAD",{
                                    APROVCADOK: "OK"
                                })
                            
                            }).catch(function (erro) {
                                req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                                res.redirect("APROVCAD");
                            })

                        })
                    })
                } else {
                    res.render("Usuarios/APROVCAD",{
                        APROVCADNC: "OK"
                        ,aRotina
                    })
                }
            })
        }).catch(function (erro) {
            res.render("Usuarios/ValidaEmail",{
                aEsqueciNC: "OK"
            })
        })
    })


    router.get('/Del', Admin, function(req, res){
        Post.Usuarios.findAll().then(function(dados) {  
            for (i = 0; i < dados.length; i++){
                if(dados[i].Admin==1){
                    dados[i].Admin = 'Sim'
                } else {
                    dados[i].Admin = 'Não'
                }
            }    
            res.render('Usuarios/Del', { 
                aUsuarios: dados
                ,aUsuarioMenu: cMenu
                ,aRotina
            });     
        })     
    }); 

    router.get('/Del/:id', Admin, function(req, res){
        Post.Usuarios.findAll({
            where: {
                id: req.params.id
            }
        }).then(function(dados) {
            for (i = 0; i < dados.length; i++){
                if(dados[i].Admin==1){
                    dados[i].Admin = 'Sim'
                } else {
                    dados[i].Admin = 'Não'
                }
            }   
            res.render('Usuarios/Del', { 
                aUsuariosDel: dados
                ,aUsuarioMenu: cMenu
                ,aRotina
            });     
        })   
    }) 

    router.post('/Del', Admin, function(req, res){
        Post.Usuarios.destroy( {where: { id: req.body.id } })  
        .then(function() { 
            req.flash("success_msg", "Cadastro removido com sucesso!");
            res.redirect("/Usuarios/Del/");
        }).catch(function(erro){
            req.flash("error_msg", "Houve um erro ao remover o cadastro, tente novamente!" + erro);
            res.redirect("/Usuarios/Del/");
        }) 
    });

    router.get("/Login", (req, res) => {
        res.render("Usuarios/Login",{
            aMenu
            ,aModulo
            ,aRotina
        })
    })   

    router.post("/Login", (req, res, next) => {
        nBemVindo = 0
        passport.authenticate("local", {
            successRedirect: "/"
            ,failureRedirect: "/Usuarios/Login"
            ,failureFlash: true
            ,successFlash: true
        })(req, res, next)
    })
    
    router.get("/Logout", (req, res) => {
        req.logout()
        req.flash("success_msg", "Deslogado com sucesso")
        res.render("Usuarios/Login",{
            aModulo
            ,aRotina
        })
    })


    router.get("/Esqueci",  (req, res) => {
        res.render("Usuarios/Esqueci")
    })

    router.post("/Esqueci",  (req, res) => {
        var id = crypto.randomBytes(20).toString('hex');
        Post.Usuarios.findAll({ where: { Email: req.body.email } } ).then((dados) => {   
           if(dados.length > 0) {
                const EsqueciEmail = new Post.Esqueci ({
                    CHAVE: id
                    ,EMAIL: req.body.email
                    ,STATUS: 1
                })
                EsqueciEmail.save().then(() => {
                    res.render("Usuarios/Esqueci",{
                        aEsqueci: aMenu
                    })
                    EnviaEmailEsqueci(EsqueciEmail)
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao tentar gerar o codigo, tente novamente")
                    res.redirect("Esqueci")
                })
           } else {
                req.flash("error_msg", "e-mail não localizado!")
                res.redirect("Esqueci")
           }
        })
    })

    
    router.get("/Esqueci/:chave",  (req, res) => {
        var id = crypto.randomBytes(3).toString('hex');
        Post.Esqueci.findAll({ where: { CHAVE: req.params.chave } } ).then((dados) => {   
            Post.Usuarios.findAll({ where: { Email: dados[0].EMAIL } } ).then((dados2) => {                
                if(dados.length > 0 && dados2.length > 0 && dados[0].STATUS == '1') {                
                    const AlteraSenha = ({
                        Senha: id
                    })
                    const AlteraStatus = ({
                        STATUS: 2
                    })
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(AlteraSenha.Senha, salt, (erro, hash) => {
                            if(erro){
                                req.flash("erros_msg", "Houve um erro ao salvar o usuário")
                                res.redirect("Esqueci")
                            }
                            AlteraSenha.Senha = hash
                            Post.Usuarios.update(AlteraSenha, { where: { id: dados2[0].id } }).then(function() {
                                Post.Esqueci.update(AlteraStatus, { where: { EMAIL: dados[0].EMAIL } }).then(function() {
                                    res.render("Usuarios/Esqueci",{
                                        aEsqueciOK: aMenu
                                    })
                                    EnviaEmailAlterada(dados2, id) 
                                }).catch(function (erro) {
                                    req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                                    res.redirect("Esqueci");
                                })
                            }).catch(function (erro) {
                                req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                                res.redirect("Esqueci");
                            })
                        })
                    })
                } else {
                    res.render("Usuarios/Esqueci",{
                        aEsqueciNC: aMenu
                        ,aRotina
                    })
                }
            })
        })
    })


    //PROFILES
        router.get("/Profiles", BuscaReal, (req, res) => {
            Post.Usuarios.findAll({ where: { Email: res.locals.user.Email } } ).then((usuarios) => {   
                res.render("Usuarios/Profiles/index", {
                    aProfiles: usuarios
                    ,aRotina
                })
            })
        })


        router.post("/Profiles", BuscaReal, (req, res) => {
            var erros = [];

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome Inválido"})
            }

            if(req.body.senha != '' || req.body.senha2 != '') {

                if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                    erros.push({texto: "Senha Inválida"})
                }

                if(req.body.senha.length < 4) {
                    erros.push({texto: "Senha muito curta"})
                }

                if(req.body.senha!= req.body.senha2) {
                    erros.push({texto: "As senhas não coferem, tente novamente"})
                }
            }

            // Valida erros e adiciona registro
            if(erros.length > 0) {
                Post.Usuarios.findAll({
                    where: {
                        id: req.body.id
                    }
                }).then(function(dados) {
                    res.render("Usuarios/Profiles", { 
                        erros: erros 
                        ,aProfiles: dados
                        ,aRotina
                    })
                })
            } else {
                if(req.body.senha != '') {
                    const AlteraUsuario = ({
                        Nome: req.body.nome
                        ,Senha: req.body.senha
                        ,UserERP: req.body.UserERP
                    })
                    
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(AlteraUsuario.Senha, salt, (erro, hash) => {
                            if(erro){
                                req.flash("erros_msg", "Houve um erro durante o salvamento do usuário")
                                res.redirect("/Usuarios/Profiles")
                            }
                            AlteraUsuario.Senha = hash
                            Post.Usuarios.update(AlteraUsuario, { where: { id: req.body.id } })
                            .then(function() {
                                req.flash("success_msg", "Cadastro alterado com sucesso!");
                                res.redirect("/Usuarios/Profiles");
                            }).catch(function (erro) {
                                req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                                res.redirect("/Usuarios/Profiles");
                            })

                        })
                    })
                } else {
                    const AlteraUsuario = ({
                        Nome: req.body.nome
                        ,UserERP: req.body.UserERP
                    })

                    Post.Usuarios.update(AlteraUsuario, { where: { id: req.body.id } })
                    .then(function() {
                        req.flash("success_msg", "Cadastro alterado com sucesso!");
                        res.redirect("/Usuarios/Profiles");
                    }).catch(function (erro) {
                        req.flash("error_msg", "Houve um erro ao salvar a alteração, tente novamente!" + erro);
                        res.redirect("/Usuarios/Profiles");
                    })
                }
            }
        })

module.exports = router;



function EnviaEmail(params, id2) {
    chtml =  ' <div>                                                                                                                                                '
    chtml += '   <h2>Bem Vindo(a) ao Portal AllianceSA </h3>                                                                                                        '
    chtml += '   <pre>Recebemos seu pedido de registro de conta, favor confirmar seu e-mail. </pre>                                                                 '
    chtml += '   <pre><strong>Endereço: </strong><a href="https://alliancesa.herokuapp.com/">https://alliancesa.herokuapp.com/</a></pre>                            '
    //chtml += '   <pre>Confirme seu e-mail clicando <strong><a href="http://localhost:8383/Usuarios/ValidaEmail/' + id2 + '" a>aqui</strong></pre>   '
    //chtml += '   <pre>Confirme seu e-mail clicando <strong><a href="http://177.220.138.5:9393/Usuarios/ValidaEmail/' + id2 + '" a>aqui</strong></pre>   '
    chtml += '   <pre>Confirme seu e-mail clicando <strong><a href="https://alliancesa.herokuapp.com/Usuarios/ValidaEmail/' + id2 + '" a>aqui</a></strong></pre>    '
    chtml += ' </div>                                                                                                                                               '

    const mailOptions = {
        from: "alliancesa34@gmail.com"
        ,to: "'" + params.email + "'"
        ,bcc: 'tdrgoblin@gmail.com'
        ,subject: 'Bem Vindo(a) ao Portal AllianceSA - Validação de e-mail'
        //text: 'Bem fácil, não? ;)'
        ,html: chtml
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });
}

function EnviaAdmin(params, id2) {
    chtml =  ' <div>                                                                                                                                        '
    chtml += '   <h2>Novo Cadastro Portal AllianceSA </h3>                                                                                                  '
    chtml += '   <pre>Novo cadatro realizado aguarado aprovação....... bla bla bla bla. </pre>                                                              '
    chtml += '   <pre></pre>                                                                                                                                '
    chtml += '   <pre></pre>                                                                                                                                '
    chtml += '   <pre><strong>E-Mail:  </strong> ' + params.EMAIL   + '</pre>                                                                               '
    chtml += '   <pre><strong>DISCORD: </strong> ' + params.DISCORD + '</pre>                                                                               '
    chtml += '   <pre><strong>DISCORD: </strong> ' + params.FONE + '</pre>                                                                                  '
    chtml += '   <pre></pre>                                                                                                                                '
    chtml += '   <pre>Clique <a href="https://alliancesa.herokuapp.com/Usuarios/APROVCAD/' + id2 + '" a>aqui</a></strong> para liberar o cadastro</pre>     '
    chtml += ' </div>                                                                                                                                       '

    const mailOptions = {
        from: "alliancesa34@gmail.com"
        //,to:  "'" + params.email + "'"
        ,bcc: 'tdrgoblin@gmail.com ' //;tiagodalua@gmail.com'
        ,subject: 'Portal AllianceSA - Novo Cadastro'
        //text: 'Bem fácil, não? ;)'
        ,html: chtml
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });
}


function EnviaCadOK(params, cSenha) {
    chtml =  ' <div>                                                                                                                               '
    chtml += '   <h2>Cadastro Liberado Portal AllianceSA </h3>                                                                                     '
    chtml += '   <pre>Novo cadatro liberado para uso....... bla bla bla bla. </pre>                                                                '
    chtml += '   <pre></pre>                                                                                                                       '
    chtml += '   <pre><strong>Endereço: </strong><a href="https://alliancesa.herokuapp.com/">https://alliancesa.herokuapp.com/</a></pre>           '
    chtml += '   <pre></pre>                                                                                                                       '
    chtml += '   <pre><strong>E-Mail: </strong> ' + params.EMAIL   + '</pre>                                                                       '
    chtml += '   <pre><strong>Senha : </strong> ' + cSenha         + '</pre>                                                                       '
    chtml += '   <pre></pre>                                                                                                                       '
    chtml += ' </div>                                                                                                                              '

    const mailOptions = {
        from: "alliancesa34@gmail.com"
        //,to:  "'" + params.email + "'"
        ,bcc: 'tdrgoblin@gmail.com ' //;tiagodalua@gmail.com'
        ,subject: 'Portal AllianceSA - Cadastro Liberado'
        //text: 'Bem fácil, não? ;)'
        ,html: chtml
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });

}


function EnviaEmailEsqueci(params) {

    chtml =  ' <div>                                                                                 '
    chtml += '   <h2>Portal AllianceSA</h3>                                                            '
    chtml += '   <pre>Foi realizado uma solicitação de redefinição de senha. </pre>                  '
    chtml += '   <pre>Clique <strong><a href="https://alliancesa.herokuapp.com/Usuarios/Esqueci/' + params.CHAVE + '">aqui</a></strong> para redifinir a nova senha</pre> '
    chtml += '   <pre><strong>E-Mail: </strong> ' + params.EMAIL + '</pre>                           '
    chtml += '   <pre>Caso não reconheça essa solicitação favor desconsiderar esse e-mail. </pre>    '
    chtml += ' </div>                                                                                '

    const mailOptions = {
        from: "alliancesa34@gmail.com"
        ,to: "'" + params.EMAIL + "'"
        ,bcc: 'tdrgoblin@gmail.com ' //;tiagodalua@gmail.com'
        ,subject: 'Portal AllianceSA - Redefinição de senha'
        //text: 'Bem fácil, não? ;)'
        ,html: chtml
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });
}

function EnviaEmailAlterada(params, id) {

    chtml =  ' <div>                                                                                                             '
    chtml += '   <h2>' + params[0].Nome + ' a senha do Portal AllianceSA foi redefinida com sucesso.</h3>                             '
    chtml += '   <pre>Para acessar o portal você deverá utilizar as seguintes credenciais: </pre>                                '
    chtml += '   <pre><strong>Endereço: </strong><a href="https://alliancesa.herokuapp.com">https://alliancesa.herokuapp.com</a></pre>       '
    chtml += '   <pre><strong>Usuário: </strong>' + params[0].Email + '</pre>                                                       '
    chtml += '   <pre><strong>Senha: </strong>' + id + '</pre>                                                         '
    chtml += ' </div>                                                                                                            '    

    const mailOptions = {
        from: "alliancesa34@gmail.com"
        ,to: "'" + params[0].Email + "'"
        ,bcc: 'tdrgoblin@gmail.com ' //;tiagodalua@gmail.com'
        ,subject: 'Portal AllianceSA - Senha Alterada'
        //text: 'Bem fácil, não? ;)'
        ,html: chtml
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });
}