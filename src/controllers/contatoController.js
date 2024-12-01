const Contato = require('../models/contatoModel')

exports.index = (req, res) => {
    res.render('contato')
    return
}

exports.register = async (req, res) => {
    
    try {      
        const contato = new Contato(req.body) 
        
        await contato.valida()

        if(contato.errors.length > 0) {
            res.location(req.get("Referrer"))
            req.flash('errors', contato.errors)
            return
        }
        res.location(req.get("Referrer"))
        req.flash('sucess', 'contato registrado com sucesso!')
        return

    }
    catch(e) {
        console.log(e)
        return res.render('errorPage')
    }

    
}