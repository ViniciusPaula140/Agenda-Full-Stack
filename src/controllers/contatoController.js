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

exports.edit = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                return res.redirect(`/contato/index/${req.params.id}`); // Redireciona de volta para a página de edição
            });
            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });
    } catch(e) {
        console.log(e);
        req.flash('errors', 'Erro ao editar o contato');
        req.session.save(() => {
            return res.redirect(`/contato/index/${req.params.id}`); // Mantém na página de edição em caso de erro
        });
    }
}

exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('errorPage');
    
    const contato = await Contato.delete(req.params.id);
    if (!contato) return res.render('errorPage');

    req.flash('success', 'Contato Excluido com sucesso!');
    req.session.save(() => {
        return res.redirect(`/`); 
    })
}