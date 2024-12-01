const { render } = require('ejs');
const Contato = require('../models/contatoModel');

exports.index = (req, res) => {
    res.render('contato', { contato: {} });
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
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });
    } catch(e) {
        console.log(e);
        req.flash('errors', 'Erro ao salvar o contato');
        req.session.save(() => {
            return res.redirect('/contato/index');
        });
    }
}

exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('errorPage');
    
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('errorPage');

    res.render('contato', { contato });
}