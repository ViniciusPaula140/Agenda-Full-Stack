const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema) //Comando para criar no DB

class Login {
    constructor(body) {
        this.body = body;  //Tenho o body disponivel em todos os metodos da classe
        this.errors = [];
        this.user = null
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
    
        try {
            this.user = await LoginModel.findOne({ email: this.body.email });
    
            if(!this.user) {
                this.errors.push('Usuário não existe');
                return;
            }
    
            if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
                this.errors.push('Senha inválida');
                this.user = null;
                return;
            }
        } catch(e) {
            console.error('Erro durante login:', e);
            this.errors.push('Erro ao realizar login');
        }
    }
 
    async register(){
        this.valida()
        if(this.errors.length > 0) return
        
        await this.userExiste()

        if(this.errors.length > 0) return

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        this.user = await LoginModel.create(this.body) //Para caso eu queira usar o usuario ele 
        

    }
    
    cleanUp() {
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
            // Remover espaços em branco extras
            if(typeof this.body[key] === 'string') {
                this.body[key] = this.body[key].trim();
            }
        }
 
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
 
    valida() {
        this.cleanUp()
        
        if(!this.body.email) this.errors.push('E-mail é obrigatório');
        if(!this.body.password) this.errors.push('Senha é obrigatória');
        
        if(this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        
        if(this.body.password && (this.body.password.length < 3 || this.body.password.length > 50)) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
    }

    async userExiste(){
        this.user = await LoginModel.findOne({email: this.body.email})
        if(this.user) this.errors.push('Usuário já existe')
    }


}

module.exports = Login;

//Se faz o modelo para que a req.body passe por uma validação de dados, nunca s epode aceitar diretamente no DB oq foi enviado sem tratamento por um POST, questão de segurança