const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const contatosController = require('./src/controllers/contatosController')

//Rotas da home
route.get('/', homeController.paginaInicial);
route.post('/', homeController.trataPost)

//Rota para contato
route.get('/contatos', contatosController.contatos)


module.exports = route //Está exports todas as rotas do router (linha 2)