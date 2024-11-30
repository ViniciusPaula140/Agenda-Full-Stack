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
 
    async register(){
        this.valida()
        if(this.errors.length > 0) return
        
        await this.userExiste()

        if(this.errors.length > 0) return

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        try {

            this.user = await LoginModel.create(this.body) //Para caso eu queira usar o usuario ele 
        }
        catch(e) {
            console.log(e)
        }
        
    }
    
    valida(){
        this.cleanUp()
        //Email valido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')
        
        //Senha entre 3 a 50 caracteres
        if(this.body.password.length <3 || this.body.password.length >50) this.errors.push('A senha precisa ter 3 a 50 caracteres')
    }

    cleanUp() {
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }

    async userExiste(){
        this.user = await LoginModel.findOne({email: this.body.email})
        if(this.user) this.errors.push('Usuário já existe')
    }


}

module.exports = Login;

//Se faz o modelo para que a req.body passe por uma validação de dados, nunca s epode aceitar diretamente no DB oq foi enviado sem tratamento por um POST, questão de segurança