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
        'images/carta6.png'];
        this.pickedCards = [];
        this.pickedCardsIndex = [];
        this.matches = 0;
        this.counter = document.getElementById('contador');
        this.timerElement = document.getElementById('timer');
        this.timer = 32; // segundos
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

            if (this.pickedCards.length === 2) {
                setTimeout(() => this.checkMatch(), 1000);
            }
        }
    }

    checkMatch() {
        const [firstIndex, secondIndex] = this.pickedCardsIndex;
        const [firstCard, secondCard] = this.pickedCards;

        if (firstCard === secondCard) {
            this.matches++;
            if (this.matches === this.cards.length / 2) {
                alert('¡Felicidades, has ganado!');
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
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerElement.textContent = this.timer;

            if (this.timer === 0) {
                alert('¡Tiempo agotado! Intenta de nuevo.');
                this.resetGame();
            }
        }, 1000);
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.pickedCards = [];
        this.pickedCardsIndex = [];
        this.matches = 0;
        this.timer = 32;
        this.timerElement.textContent = this.timer;
        this.shuffleCards();
        this.createBoard();
        this.startTimer();
    }
}
