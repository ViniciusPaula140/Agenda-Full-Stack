const HomeModel = require('../models/homeModels')

exports.paginaInicial = (req, res) => {
    res.render(`index`, {titulo: "eu sou um titulo 2"})
    return;
}

exports.trataPost = (req, res) => {
    res.send(req.body)
    return;
}
