const Contato = require('../models/contatoModel');

exports.index = (req, res) => {
    res.render('contato');
}

exports.register = async (req, res) => {
    try {      
        const contato = new Contato(req.body);
        await contato.valida();

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                return res.redirect('/contato/index');
            });
            return;
        }

        await contato.register(); // Adicionando o método register

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => {
            return res.redirect('/contato/index');
        });
    } catch(e) {
        console.log(e);
        req.flash('errors', 'Erro ao salvar o contato');
        req.session.save(() => {
            return res.redirect('/contato/index');
        });
    }
}