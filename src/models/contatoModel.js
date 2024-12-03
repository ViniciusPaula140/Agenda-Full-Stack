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

    static async buscaPorId(id) {
        if(!id) return null;
        try {
            const contato = await ContatoModel.findById(id);
            return contato;
        } catch(e) {
            console.error('Erro ao buscar contato:', e);
            return null;
        }
    }

    static async buscaContatos() {
        try {
            const contatos = await ContatoModel.find()
                .sort({ criadoEm: -1 }); // -1 para ordem decrescente (mais novos primeiro)
            return contatos;
        } catch(e) {
            console.error('Erro ao buscar contatos:', e);
            throw new Error('Erro ao buscar contatos');
        }
    }

    static async delete(id) {
        if(typeof id !== 'string') return;
        try {
            const contatos = await ContatoModel.findOneAndDelete(id)
                .sort({ criadoEm: -1 }); // -1 para ordem decrescente (mais novos primeiro)
            return contatos;
        } catch(e) {
            console.error('Erro ao buscar contatos:', e);
            throw new Error('Erro ao buscar contatos');
        }
    }

    async edit(id) {
        if(typeof id !== 'string') return;
        
        try {
            this.valida();
            if(this.errors.length > 0) return;
    
            this.contato = await ContatoModel.findByIdAndUpdate(
                id, 
                this.body, 
                { 
                    new: true,  // Retorna o documento atualizado
                    runValidators: true  // Executa os validadores do Schema
                }
            );
    
            if(!this.contato) {
                this.errors.push('Contato não encontrado.');
                return;
            }
        } catch(e) {
            console.error('Erro ao editar contato:', e);
            this.errors.push('Erro ao editar o contato.');
        }
    }
}

module.exports = Contato;

//Se faz o modelo para que a req.body passe por uma validação de dados, nunca s epode aceitar diretamente no DB oq foi enviado sem tratamento por um POST, questão de segurança