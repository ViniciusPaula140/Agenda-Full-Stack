export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => { 
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        let error = false;

        // Remove mensagens de erro anteriores
        this.clearErrors();

        // Validação do email
        if(!emailInput.value) {
            this.createError(emailInput, 'Email precisa ser preenchido');
            error = true;
        }

        // Validação da senha
        if(passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            this.createError(passwordInput, 'Senha precisa ter entre 3 e 50 caracteres');
            error = true;
        }

        if(!error) this.form.submit();
    }

    createError(field, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('text-danger');
        field.insertAdjacentElement('afterend', div);
    }

    clearErrors() {
        const errorMessages = this.form.querySelectorAll('.text-danger');
        errorMessages.forEach(error => error.remove());
    }
}