const Contato = require('../models/contatoModel')

exports.index = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/contato/index'); // Redireciona se o usuário não estiver logado
        }

        const contatos = await Contato.buscaContatos(req.session.user._id); // Passando o userId
        res.render('index', { contatos });
    } catch (e) {
        console.log(e);
        res.render('errorPage'); 
    }
};


