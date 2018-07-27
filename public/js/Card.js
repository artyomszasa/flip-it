'use strict';

class Card {

    /**
     * Create Card
     * @param {string} value
     */
    constructor (value) {
        /**
         * Backface
         */
        this.placeholder = 'X';
        /**
         * Front
         */
        this.value = value;
        /**
         * Card locked
         */
        this.locked = false;
    }

    /**
     * Render Card DOM
     * @returns {HTMLElement} - Card HTMLElement
     */
    render () {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = this.placeholder;
        card.addEventListener('click', this.flip.bind(this));
        this.element = card;
        return card;
    }

    /**
     * Flip card
     * @param {Object} evt
     */
    flip (evt) {
        const button = evt.target.closest('button');
        if (this.locked || button.textContent === this.value) {
            return;
        }
        const flipEvent = new CustomEvent('flip', {
            detail: {
                card: this
            }
        });
        button.textContent = this.value;
        document.body.dispatchEvent(flipEvent);
    }

    /**
     * Replace Card with an invisible placeholder
     */
    remove () {
        this.element.className = 'card-placeholder'
    }

    /**
     * Unflip card
     */
    unflip () {
        this.element.textContent = this.placeholder;
    }

    /**
     * Locks card
     */
    lock () {
        this.locked = true;
    }

    /**
     * Unlocks card
     */
    unlock () {
        this.locked = false;
    }
}