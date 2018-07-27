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
