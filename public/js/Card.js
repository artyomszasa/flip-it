class Card {
    constructor (value) {
        this.placeholder = 'X';
        this.value = value;
    }
    render () {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = this.placeholder;
        card.addEventListener('click', this.flip.bind(this));
        this.element = card;
        return card;
    }
    flip (evt) {
        const button = evt.target.closest('button');
        const flipEvent = new CustomEvent('flip', {
            detail: {
                card: this
            }
        });
        if (button.textContent !== this.value) {
            button.textContent = this.value;
            document.body.dispatchEvent(flipEvent);
        }
    }
    remove () {
        this.element.className = 'card-placeholder'
    }
    unflip () {
        this.element.textContent = this.placeholder;
    }
}