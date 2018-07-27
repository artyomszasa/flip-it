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
    fetch('/score', {
        method: 'POST',
        body: {
            Score: {
                steps: stats.steps,
                token: stats.token,
                seconds: stats.seconds,
                name: stats.name
            }
        }
    })
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
 * Start button
 */
const startButton = document.createElement('button');
startButton.className = 'start';
startButton.textContent = 'Start Game';
startButton.addEventListener('click', evt => {
    start({ size: 20 }).then(game => {
        if (game.err) {
            console.log(game.err);
            return;
        }
        window.game = {
            flips: 0,
            flipped: [],
            startTime: Date.now(),
            token: game.token,
            name: 'Marci'
        };
        clearDeck(deckElement);
        const deck = game.pictures
            .map(value => new Card(value));
        deck.forEach(card => deckElement.appendChild(card.render()));
    });
});
deckElement.appendChild(startButton);
