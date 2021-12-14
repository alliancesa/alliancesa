const express = require('express');
const router = express.Router();
const db = require("../models/db")
const Post = require('../models/Admin');
const Op = db.sequelize.Op;

//const Empresas = require("./Admin/Empresas")

const { Admin } = require("../helpers/Admin")

    // Variaveis Globais
    aMenu   = []
    aModulo = []
    aRotina = []

    router.get('/', Admin, function (req, res) {
        res.render('admin/index', {
            aAdmin: aMenu
            ,aAdminMenu: aMenu
            //,aMenu
            //,aModulo
            ,aRotina
        });
    });

/*
// EMPRESAS
    router.get('/Empresas/', Empresas)
    router.get('/Empresas/Codigo/:id', Empresas)
    router.post('/Empresas/add', Empresas)
    router.post('/Empresas/edit', Empresas)
    router.post('/Empresas/del', Empresas)
    router.get('/Empresas/add', Empresas)
    router.get('/Empresas/edit', Empresas)
    router.get('/Empresas/del', Empresas)
    router.get('/Empresas/edit/:id', Empresas)
    router.get('/Empresas/del/:id', Empresas)
*/

    
module.exports = router;
