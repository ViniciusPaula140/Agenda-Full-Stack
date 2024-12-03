// Função para fazer as mensagens desaparecerem
const fadeOut = (element) => {
    let opacity = 1;
    const timer = setInterval(() => {
        if (opacity <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = opacity;
        opacity -= opacity * 0.1;
    }, 50);
}

// Auto-executar para mensagens flash
document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelectorAll('.alert');
    
    messages.forEach(message => {
        // Aguarda 1,5 segundos antes de começar a desaparecer
        setTimeout(() => {
            fadeOut(message);
        }, 1500);
    });
});