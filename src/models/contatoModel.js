const mongoose = require('mongoose')
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default:''},
    email: {type: String, required: false, default:''},
    telefone: {type: String, required: false, default:''},
    criadoEm: {type: Date, default: Date.now}
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }    

    async register() {
        this.valida();
        if(this.errors.length > 0) return;
        
        try {
            this.contato = await ContatoModel.create(this.body);
        } catch(e) {
            console.error(e);
            throw new Error('Erro ao criar contato');
        }
    }

    valida() {
        this.cleanUp();
        
        if(this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        if(!this.body.nome) {
            this.errors.push('Campo nome é obrigatório');
        }
        if(!this.body.email && !this.body.telefone) {
            this.errors.push('Preencha ou email ou telefone para o contato que deseja registrar.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
            if(typeof this.body[key] === 'string') {
                this.body[key] = this.body[key].trim();
            }
        }
 
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            telefone: this.body.telefone,
            email: this.body.email,
        }
    }
}

module.exports = Contato;

//Se faz o modelo para que a req.body passe por uma validação de dados, nunca s epode aceitar diretamente no DB oq foi enviado sem tratamento por um POST, questão de segurança