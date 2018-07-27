'use strict';

/**
 * Starts the game
 * @param {Object} config - Sets the number of cards, with the size property.
 */
function start (config) {
    config = {
        size: config && config.size % 2 === 0 ? config.size : 20
    };
    return new Promise(resolve => {
        fetch(`/game/${config.size}`, {
            mode: 'cors',
        })
            .then(response => response.ok ? response.json() : { err: 'Err' })
            .then(game => {
                resolve(game);
            })
            .catch(err => {
                resolve(err);
            });
    });
}

/**
 * Sends the stats to the backend, when the game ends.
 * @param {Object} stats - steps (clicks / 2), token, elapsed time, player's name
 */
function end (stats) {
    return new Promise(resolve => {
        const score = {
            steps: stats.steps,
            token: stats.token,
            seconds: stats.seconds,
            name: stats.name
        };
        fetch('/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(score)
        })
            .then(response => response.ok ? { win: true } : { err: 'Err' })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                resolve(err);
            });
    });
}

/**
 * Clears the game area.
 * @param {HTMLElement} deckElement - Game area
 */
function clearDeck (deckElement) {
    deckElement.innerHTML = '';
}

const deckElement = document.getElementById('deck');

/**
 * Start view
 */
const startButton = document.createElement('button');
const nameField = document.createElement('input');
const sizeField = document.createElement('input');
nameField.setAttribute('name', 'name');
sizeField.setAttribute('name', 'size');
nameField.setAttribute('placeholder', 'Name');
sizeField.setAttribute('placeholder', 'Size');
startButton.className = 'start';
startButton.textContent = 'Start Game';
startButton.addEventListener('click', evt => {
    const config = {
        size: sizeField.value,
        name: nameField.value
    };
    start(config).then(game => {
        if (game.err) {
            console.log(game.err);
            return;
        }
        window.game = {
            flips: 0,
            flipped: [],
            startTime: Date.now(),
            token: game.token,
            name: config.name
        };
        clearDeck(deckElement);
        const deck = game.pictures
            .map(value => new Card(value));
        deck.forEach(card => deckElement.appendChild(card.render()));
    });
});
[nameField, sizeField, startButton].forEach(el => deckElement.appendChild(el));

/**
 * Handle flips
 */
document.body.addEventListener('flip', (evt) => {
    const game = window.game;
    game.flips = game.flips + 1;
    const card = evt.detail.card;
    game.flipped.push(card);
    if (game.flipped.length === 2) {
        window.setTimeout(() => {
            if (game.flipped.every(card => card.value === game.flipped[0].value)) {
                game.flipped.forEach(card => card.remove());
            } else {
                game.flipped.forEach(card => card.unflip());
            }
            game.flipped = [];

            if (deckElement.querySelectorAll('.card').length === 0) {
                end({
                    steps: game.flips / 2,
                    token: game.token,
                    seconds: Math.round((Date.now() - window.game.startTime) / 1000),
                    name: game.name
                }).then(response => {
                    clearDeck(deckElement);
                    const msg = response.win ? 'You won!' : 'Error!';
                    deckElement.innerHTML = `<p>${msg}</p>`;
                });
            }
        }, 1000);
    }
});