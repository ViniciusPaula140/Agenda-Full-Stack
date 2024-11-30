const Login = require('../models/loginModel')

exports.index = (req, res) => {
    res.render('login', {
        errors: req.flash('errors'),
        success: req.flash('success')
    });
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
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Usuário criado com sucesso!');
        req.session.user = login.user
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