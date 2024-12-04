import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';

import Login from './modules/validator_login';

const cadastro = new Login('.login-cadastro');
const login = new Login('.login-login');

cadastro.init();
login.init();


