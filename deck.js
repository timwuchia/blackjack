const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export default class Deck {
    constructor(cards=freshDeck()){
        this.cards = cards;
    }

    numberOfCards() {
        return this.cards.length;
    }

    popTwoCards() {
        return this.cards.splice(0, 2);
    }

    popCard(){
        return this.cards.shift();
    }

    /************* Learn how this is going to work ************/
    shuffle(){
        for (let i = this.numberOfCards() - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

}

class Card {
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
        this.color = this.suit === "♣" || this.suit === "♠" ? "black" : "red"
    }

    getHTML() {
        const cardDiv = document.createElement("div")
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.card = `${this.value} ${this.suit}`
        return cardDiv
      }
}

export class PlayerHand {
    constructor(){
        this.hand = []
    }
    initCard(arr) {
        this.hand = arr
    }
    addCardToHand(card){
        this.hand.push(card)
    }
}

export class DealerHand {
    constructor(hand){
        this.hand = []
    }
    initCard(arr) {
        this.hand = arr
    }
    addCardToHand(card){
        this.hand.push(card)
    }
}

/****************** Learn how this function works ********************/
function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value)
        })
    })
}