const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')
const { loginRequired } = require('./src/middlewares/globalMiddleware')


//Rotas da home
route.get('/', homeController.index);

//Rota para login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

//Rota para contato
route.get('/contato/index', loginRequired, contatoController.index)
route.get('/contato/register', loginRequired, contatoController.registroIndex); // Nova rota para a view de registro
route.post('/contato/register', loginRequired, contatoController.register)
route.get('/contato/index/:id', loginRequired, contatoController.editIndex)
route.post('/contato/edit/:id', loginRequired, contatoController.edit)
route.get('/contato/delete/:id', loginRequired, contatoController.delete)


module.exports = route //Está exports todas as rotas do router (linha 2)