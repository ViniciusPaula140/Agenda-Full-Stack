//Middleware para check erro de csrf - Para nao exibir o erro para o user e error para forms sem token
exports.checkCsrfError= (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN')  {
        return res.render('errorPage')
    }
    next()
}   

//Middleware para Token
exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
} 

