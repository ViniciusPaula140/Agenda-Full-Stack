exports.middlewareGlobal = (req, res, next) => {
    // Flash messages são para armazenar mensagens, não para definir
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
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


