exports.index = (req, res) => {
    res.render('index', {
        success: req.flash('success'),
        errors: req.flash('errors'),
        user: req.session.user
    });
};


