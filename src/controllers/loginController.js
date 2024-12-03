const Login = require('../models/loginModel')

exports.index = (req, res) => {
    if(req.session.user) {
        return res.render('login-logado')
    }
    res.render('login');
}

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Usuário criado com sucesso!');
        req.session.save(() => {
            return res.redirect('/login/index');
        });
    } catch(e) {
        console.log(e);
        req.flash('errors', 'Erro ao criar usuário');
        req.session.save(() => {
            return res.redirect('/login/index');
        });
    }
}

// Adicione o método de login
exports.login = async (req, res) => {
    try {
        if(!req.body.email || !req.body.password) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        if(!login.user) {
            req.flash('errors', 'Usuário não encontrado');
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.session.user = login.user;
        // Removemos o flash de sucesso daqui
        req.session.save(function() {
            // E movemos para depois do save da sessão
            req.flash('success', 'Login realizado com sucesso!');
            return res.redirect('/login/index');
        });
    } catch(e) {
        console.error('Erro no login:', e);
        req.flash('errors', 'Preencha todos os campos');
        req.session.save(() => {
            return res.redirect('/login/index');
        });
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login/index');
}
