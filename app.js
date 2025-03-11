// Configuración
const CONFIG = {
    WEBHOOK_URL: 'https://hook.eu1.make.com/o5ds5o0l4n7at4e93lfkc74ygr6orfhd',
    EMOJI_INTERVAL: 400,
    EMOJI_COUNT: 4,
    SUCCESS_MODAL_DURATION: 6000,
    ERROR_MESSAGE_DURATION: 5000
};

// Arrays de contenido
const CONTENT = {
    emojis: ['🔥', '💪', '🏋️‍♂️'],
    successGifs: [
        'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif', // Arnold thumbs up
        'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif', // Success kid
        'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // Carlton dance
        'https://media.giphy.com/media/l3q2Z6S6r0yuiyT3W/giphy.gif', // Dwayne Johnson success
        'https://media.giphy.com/media/11YMhfLfGoq5Gg/giphy.gif',    // Muscle spongebob
        'https://media.giphy.com/media/W9MrfVxE4s7Xq/giphy.gif',     // Hulk Hogan
        'https://media.giphy.com/media/3o7TKF5DnsSLv4zVBu/giphy.gif', // John Cena
        'https://media.giphy.com/media/l0HlFZ3c4NENSLQRi/giphy.gif', // The Rock cooking
        'https://media.giphy.com/media/3oriO24jn5FKghm7Yc/giphy.gif', // Muscle SpongeBob 2
        'https://media.giphy.com/media/YJ5OlVLZ2QNl6/giphy.gif',     // Dragon Ball Z power up
        'https://media.giphy.com/media/l41YckJ1ERz8k1hni/giphy.gif', // Workout success
        'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif', // Muscle flex
        'https://media.giphy.com/media/l41lK5NQjKm0uqPDO/giphy.gif', // Gym motivation
        'https://media.giphy.com/media/3o7TKPdUkkbCAVqWk0/giphy.gif', // Success celebration
        'https://media.giphy.com/media/l46CxDIh6HDiH9ndm/giphy.gif'  // Workout complete
    ],
    successMessages: [
        "¡Bestia! Sigue así 💪",
        "¡Eres una máquina! 🔥",
        "¡No hay quien te pare! 🚀",
        "¡Vas como un toro! 🐂",
        "¡Eres el más fuerte del trio! 🏆",
        "¡Demoledor! Estás on fire 🔥",
        "¡Leyenda viviente! 👑",
        "¡Modo bestia activado! 💯",
        "¡Imparable! Ni el muro de Berlín te detiene 🧱",
        "¡Más fuerte que el vinagre! 💪",
        "¡Ni Schwarzenegger en sus mejores tiempos! 🦾",
        "¡Te comiste la presa y el plato! 🍖",
        "¡Más duro que el hormigón armado! 🏗️",
        "¡Ni los titanes te hacen sombra! 🌟",
        "¡Más potente que un cohete de la NASA! 🚀"
    ]
};

// Utilidades
const utils = {
    getRandomItem: (array) => array[Math.floor(Math.random() * array.length)],
    getRandomNumber: (min, max) => Math.random() * (max - min) + min,
    showError: (container, message, duration = CONFIG.ERROR_MESSAGE_DURATION) => {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        container.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), duration);
    }
};

// Clase principal para manejar la aplicación
class GymBrosApp {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.startEmojiAnimation();
    }

    initializeElements() {
        this.fileUpload = document.getElementById('fileUpload');
        this.fileName = document.getElementById('fileName');
        this.submitButton = document.getElementById('submitButton');
        this.successModal = document.getElementById('successModal');
        this.successGif = document.getElementById('successGif');
        this.successMessage = document.getElementById('successMessage');
    }

    attachEventListeners() {
        this.fileUpload.addEventListener('change', () => this.handleFileChange());
        this.submitButton.addEventListener('click', () => this.handleSubmit());
    }

    handleFileChange() {
        if (this.fileUpload.files && this.fileUpload.files[0]) {
            this.fileName.textContent = this.fileUpload.files[0].name;
        }
    }

    async handleSubmit() {
        const userName = document.getElementById('userName').value;
        const activity = document.getElementById('activity').value;
        const file = this.fileUpload.files[0];

        if (!this.validateForm(userName, activity, file)) return;

        const formData = this.createFormData(userName, activity, file);
        await this.submitForm(formData);
    }

    validateForm(userName, activity, file) {
        if (!userName || !activity || !file) {
            utils.showError(document.querySelector('.file-upload-container'), 
                'Por favor, completa todos los campos y selecciona un archivo.');
            return false;
        }
        return true;
    }

    createFormData(userName, activity, file) {
        const timeZone = userName === 'Gav' ? 'Europe/Madrid' : 'America/Bogota';
        const currentDate = new Date().toLocaleString('es-ES', {
            timeZone,
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/(\d+)\/(\d+)\/(\d+)/, '$1/$2/$3');

        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('activity', activity);
        formData.append('file', file);
        formData.append('timestamp', currentDate);
        formData.append('timeZone', timeZone);
        return formData;
    }

    async submitForm(formData) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', CONFIG.WEBHOOK_URL, true);

            xhr.onload = () => {
                if (xhr.status === 200) {
                    this.showSuccessModal();
                } else {
                    throw new Error(xhr.statusText);
                }
            };

            xhr.onerror = () => {
                throw new Error('Error de conexión');
            };

            xhr.send(formData);
        } catch (error) {
            console.error('Error:', error);
            utils.showError(document.querySelector('.file-upload-container'), 
                'Error al subir el archivo. Por favor, intenta de nuevo.');
        }
    }

    showSuccessModal() {
        this.successGif.src = utils.getRandomItem(CONTENT.successGifs);
        this.successMessage.textContent = utils.getRandomItem(CONTENT.successMessages);
        this.successModal.style.display = 'block';

        setTimeout(() => {
            this.successModal.style.display = 'none';
            window.location.href = window.location.pathname;
        }, CONFIG.SUCCESS_MODAL_DURATION);
    }

    createEmoji() {
        for (let i = 0; i < CONFIG.EMOJI_COUNT; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'fire-emoji';
            emoji.textContent = utils.getRandomItem(CONTENT.emojis);
            
            emoji.style.left = `${Math.random() * window.innerWidth}px`;
            emoji.style.fontSize = `${utils.getRandomNumber(20, 30)}px`;
            
            document.body.appendChild(emoji);
            emoji.addEventListener('animationend', () => emoji.remove());
        }
    }

    startEmojiAnimation() {
        setInterval(() => this.createEmoji(), CONFIG.EMOJI_INTERVAL);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GymBrosApp();
}); 