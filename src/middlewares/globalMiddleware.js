exports.middlewareGlobal = (req, res, next) => {
    // Flash messages são para armazenar mensagens, não para definir
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user
    next();
}


//Middleware para check erro de csrf - Para nao exibir o erro para o user e error para forms sem token
exports.checkCsrfError= (err, req, res, next) => {
    if(err)  {
        return res.render('errorPage')
    }
    next()
} 

//Middleware para Token
exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
} 

exports.loginRequired = (req, res, next) => {
    if(!req.session.user) {
        req.session.save(() => res.redirect('/login/index'))
        req.flash('errors', 'Você precisa está logado')
        return
    }

    next()
}

