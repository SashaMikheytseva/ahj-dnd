export default class Card {
    constructor(content) {
        this.content = content;
    }

    createCard(content) {
        return ` 
        <div class="card-wrapper">
            <div class="card-content">${content}</div>
            <span class="card-remover">X</span>
        </div>
        `;
    }

    removeCard(cardEl) {
        cardEl.remove();
    }
}