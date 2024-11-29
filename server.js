// Carregando variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importando pacotes necessários
const express = require('express');  // Framework para criar o servidor
const app = express();  // Inicializando o servidor Express

const mongoose = require('mongoose');  // Pacote para conectar ao MongoDB

// Conectando ao MongoDB usando a string de conexão armazenada nas variáveis de ambiente
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conexão com a base de dados foi bem sucedida!');  // Log quando a conexão for bem-sucedida
        app.emit('pronto');  // Emitindo um evento 'pronto' para sinalizar que a conexão foi estabelecida
    })
    .catch(e => console.log(e));  // Log de erro caso a conexão falhe

// Importando as rotas e middlewares
const routes = require('./routes');  // Importando as rotas do sistema
const path = require('path');  // Utilitário para manipulação de caminhos de arquivos
const { checkCsrfError, csrfMiddleware } = require('./src/middlewares/globalMiddleware');  // Importando middlewares de CSRF

// Importando pacotes de segurança
const helmet = require('helmet');  // Middleware de segurança para proteger cabeçalhos HTTP
const csurf = require('csurf');  // Middleware de proteção contra ataques CSRF (Cross-Site Request Forgery)

// Importando pacotes para gestão de sessões e flash messages
const session = require('express-session');  // Middleware para gerenciar sessões do usuário
const mongoStore = require('connect-mongo');  // Armazenamento de sessões no MongoDB
const flash = require('connect-flash');  // Middleware para mensagens flash (mensagens temporárias)

// Configurando o middleware de segurança Helmet (protege contra vulnerabilidades)
app.use(helmet());  // Helmet é aplicado a todas as rotas do servidor

// Inicializando middlewares para processamento de dados da requisição
app.use(express.urlencoded({ extended: true }));  // Middleware para parsing de dados de formulários (URL-encoded)
app.use(express.json());  // Middleware para parsing de dados JSON

// Tornando a pasta 'public' acessível via URL (serve arquivos estáticos como CSS, imagens, JS)
app.use(express.static(path.resolve(__dirname, 'public')));

// Configurando a sessão do usuário
const sessionOption = session({
    secret: "Posso colocar o que quiser aqui",  // Chave secreta para assinar a sessão (mantenha seguro em produção)
    store: new mongoStore({
        mongoUrl: process.env.CONNECTIONSTRING,  // URL de conexão com o MongoDB para armazenar sessões
    }),
    resave: false,  // Não salvar a sessão se ela não for modificada
    saveUninitialized: false,  // Não salvar sessões que não foram inicializadas
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,  // O cookie da sessão vai durar 7 dias
        httpOnly: true,  // Impede acesso ao cookie via JavaScript no lado do cliente
    },
});

// Usando o middleware de sessão e mensagens flash no aplicativo
app.use(sessionOption);  // Configuração da sessão
app.use(flash());  // Middleware para mensagens flash

// Configurando a pasta de views (páginas HTML/EJS) para o servidor renderizar
app.set('views', path.resolve(__dirname, 'src', 'views'));  // Diretório onde as views estão localizadas

// Definindo o motor de template EJS para renderizar as views
app.set('view engine', 'ejs');  // Usando EJS como engine de visualização

// Usando middleware CSRF para proteção contra ataques CSRF
app.use(csurf());  // Adiciona proteção contra CSRF nas requisições
app.use(checkCsrfError);  // Middleware para verificar erros CSRF e não exibir para o usuário
app.use(csrfMiddleware);  // Middleware para adicionar o token CSRF nas respostas

// Usando as rotas definidas no arquivo 'routes.js'
app.use(routes);  // As rotas são definidas no arquivo routes.js

// Iniciando o servidor na porta 3000, após a conexão com o MongoDB ser estabelecida
app.on('pronto', () => {
    app.listen(3000, () => {  // Inicia o servidor na porta 3000
        console.log('Porta 3000 - Liberada com sucesso!');  // Log quando o servidor estiver ativo
        console.log('http://localhost:3000');  // Exibe a URL do servidor
    });
});