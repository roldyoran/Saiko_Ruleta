document.addEventListener('DOMContentLoaded', () => {
    const game = new MemoryGame();
    game.init();

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => game.resetGame());
});



// Resto del código...



class MemoryGame {
    constructor() {
        this.board = document.getElementById('gameBoard');
        this.cards = [
        'images/carta1.png', 
        'images/carta2.png', 
        'images/carta3.png', 
        'images/carta4.png',
        'images/carta5.png',
        'images/carta6.png',
        'images/carta1.png', 
        'images/carta2.png', 
        'images/carta3.png', 
        'images/carta4.png', 
        'images/carta5.png',
        'images/carta6.png',
        'images/carta8.png',
        'images/carta8.png',
        'images/carta9.png',
        'images/carta9.png',
        'images/carta10.png',
        'images/carta10.png'];
        this.pickedCards = [];
        this.pickedCardsIndex = [];
        this.matches = 0;
        this.counter = document.getElementById('contador');
        this.timerElement = document.getElementById('timer');
        this.overlay = document.getElementById('overlay');
        this.messageContainer = document.getElementById('messageContainer');
        this.loseSound = document.getElementById('loseSound');
        this.victorySound = document.getElementById('victorySound');
        this.timer = 40; // segundos
        this.timerInterval;
    }

    init() {
        this.shuffleCards();
        this.createBoard();
        this.startTimer();
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }


    createBoard() {
        this.board.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
            
            const back = document.createElement('img');
            back.classList.add('back');
            back.src = card;

            const front = document.createElement('img');
            front.classList.add('front');
            front.src = 'images/back.png';  // Cambia aquí a la imagen de la parte frontal que desees

            cardElement.appendChild(back);
            cardElement.appendChild(front);

            this.board.appendChild(cardElement);
        });
    }




    flipCard(cardElement) {
        if (this.pickedCards.length < 2 && !cardElement.classList.contains('flipped')) {
            

            cardElement.classList.add('flipped');
            const index = parseInt(cardElement.dataset.index, 10);
            this.pickedCards.push(this.cards[index]);
            this.pickedCardsIndex.push(index);

            // Incrementar el contador
            this.counter.textContent = parseInt(this.counter.textContent, 10) + 1;


            if (this.pickedCards.length === 2) {
                setTimeout(() => this.checkMatch(), 1000);
                // this.showOverlay(); // Mostrar la capa de superposición
            }
        }
    }

    showOverlay() {
        this.overlay.style.display = 'block';
    }

    hideOverlay() {
        this.overlay.style.display = 'none';
    }


    checkMatch() {
        const [firstIndex, secondIndex] = this.pickedCardsIndex;
        const [firstCard, secondCard] = this.pickedCards;

        if (firstCard === secondCard) {
            this.matches++;
            if (this.matches === this.cards.length / 2) {
                // alert('¡Felicidades, has ganado!');
                this.playVictorySound(); 
                this.showWinMessage();
                this.resetGame();
            }
        } else {
            const firstCardElement = document.querySelector(`[data-index="${firstIndex}"]`);
            const secondCardElement = document.querySelector(`[data-index="${secondIndex}"]`);
            firstCardElement.classList.remove('flipped');
            secondCardElement.classList.remove('flipped');
        }

        this.pickedCards = [];
        this.pickedCardsIndex = [];

        this.hideOverlay();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerElement.textContent = this.timer;
            
            if (this.timer === 10) {
                // Aplicar la clase 'borderAnimation' al contenedor de la botonera
                document.getElementById('msgTimer').classList.add('borderAnimation');
                setTimeout(function () {
                    document.getElementById('msgTimer').classList.remove('borderAnimation');
                }, 4000);
            }
            

            if (this.timer === 0) {
                // alert('¡Tiempo agotado! Intenta de nuevo.');
                this.playLoseSound(); // Llama a la función para reproducir el sonido
                this.showLoseMessage();
                this.resetGame();
            }
        }, 1000);
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.pickedCards = [];
        this.pickedCardsIndex = [];
        this.matches = 0;
        this.timer = 40;
        this.timerElement.textContent = this.timer;
        this.counter.textContent = 0
        this.shuffleCards();
        this.createBoard();
        this.startTimer();
    }

    showWinMessage() {
        this.messageContainer.textContent = '¡Felicidades, GANASTEEEEE!';
        this.showMessage();
    }

    showLoseMessage() {
        this.messageContainer.textContent = '¡Tiempo agotado! Intenta de nuevo...';
        this.showMessage();
    }

    showMessage() {
        this.messageContainer.style.display = 'block';
        setTimeout(() => {
            this.messageContainer.style.display = 'none';
            this.resetGame();
        }, 10000);
    }

    playLoseSound() {
        this.loseSound.play();
    }

    
    playVictorySound() {
        this.victorySound.play();
    }


}
