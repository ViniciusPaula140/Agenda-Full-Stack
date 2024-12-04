const Contato = require('../models/contatoModel');

exports.index = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/contato/index'); // Redirecionar se não estiver logado
    }
    
    const contatos = await Contato.buscaContatos(req.session.user._id); // Passando o userId
    res.render('index', { contatos }); // Renderizando a view com os contatos do usuário
}

exports.registroIndex = (req, res) => {
    res.render('registro', { 
        csrfToken: req.csrfToken(), 
        contato: {} // Passando um objeto vazio para novo contato
    });
};

exports.register = async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para registrar um contato.');
            return res.redirect('/contato/index');
        }

        const contato = new Contato({ ...req.body, userId: req.session.user._id });
        await contato.valida();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                return res.redirect('/contato/register'); // Redireciona para a nova view
            });
            return;
        }

        await contato.register();

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/`);
        });
    } catch (e) {
        console.log(e);
        req.flash('errors', 'Erro ao salvar o contato');
        req.session.save(() => {
            return res.redirect('/contato/register'); // Redireciona para a nova view em caso de erro
        });
    }
};

exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('errorPage');
    
    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('errorPage');

    res.render('contato', { contato });
}

exports.edit = async (req, res) => {
    try {
        if(!req.params.id) {
            req.flash('errors', 'ID do contato não fornecido');
            req.session.save(() => {
                return res.redirect('/');
            });
            return;
        }

        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                return res.redirect(`/contato/index/${req.params.id}`);
            });
            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/`);
        });

    } catch(e) {
        console.error('Erro ao editar contato:', e);
        req.flash('errors', 'Erro ao editar o contato. Tente novamente.');
        req.session.save(() => {
            return res.redirect(`/contato/index/${req.params.id}`);
        });
    }
}

exports.delete = async (req, res) => {
    try {
        if(!req.params.id) {
            req.flash('errors', 'ID do contato não fornecido');
            req.session.save(() => {
                return res.redirect('/');
            });
            return;
        }

        const contato = await Contato.delete(req.params.id);
        
        if(!contato) {
            req.flash('errors', 'Contato não encontrado.');
            req.session.save(() => {
                return res.redirect('/');
            });
            return;
        }

        req.flash('success', 'Contato excluído com sucesso!');
        req.session.save(() => {
            return res.redirect('/');
        });

    } catch(e) {
        console.error('Erro ao excluir contato:', e);
        req.flash('errors', 'Erro ao excluir o contato. Tente novamente.');
        req.session.save(() => {
            return res.redirect('/');
        });
    }
}