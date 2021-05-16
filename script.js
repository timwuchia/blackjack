import Deck, { DealerHand, PlayerHand } from './deck.js';
import { cardFaceValue, handHasA, setDealerFaceValue, setPlayerFaceValue, playerLost, playerWon, tieGame } from './helpers.js'


let deck = new Deck();
deck.shuffle();
const playerHand = new PlayerHand;
const dealerHand = new DealerHand;
let dealerFaceDownCardValue = 0;
let dealerASetToOne = false;
let playerASetToOne = false;
let playerValue = 0;
let dealerValue = 0;

const dealerDeck = document.querySelector('.dealer-side');
const playerDeck = document.querySelector('.player-side');
const dealerCards = document.querySelector('.dealer-side .dealer-cards');
const playerCards = document.querySelector('.player-side .player-cards');

const hitBtn = document.querySelector('.hit-btn');
const standBtn = document.querySelector('.stand-btn');
const newRoundBtn = document.querySelector('.new-round-btn');
const restartBtn = document.querySelector('.restart-btn');
const message = document.querySelector('.deck .message');

document.addEventListener("DOMContentLoaded", () => {
    startRound();
})

restartBtn.addEventListener("click", () => {
    deck = new Deck();
    startRound();
})

const flipDealerCard = () => {
    dealerValue = dealerValue + dealerFaceDownCardValue;
    const faceDownCard = document.querySelectorAll('.dealer-side .dealer-cards .card')[1]
    faceDownCard.classList.remove('facedown');
    setDealerFaceValue(dealerValue)
}

const addCard = (side, card) => {
    console.log(deck);
    if(deck.cards.length < 1) {
        message.innerHTML = 'sorry, there are no more cards';
        restartBtn.disabled = false;
        return;
    }
    if(side === 'player'){
        playerHand.hand.push(card)
        playerCards.append(card.getHTML());
    }
    if(side === 'dealer'){
        dealerHand.hand.push(card)
        dealerCards.append(card.getHTML());
    } 
}

const enableButton = (btn) => {
    switch(btn){
        case "hit" :
            hitBtn.disabled = false;
            break;
        case "stand":
            standBtn.disabled = false;
            break;
        case "new-round":
            newRoundBtn.disabled = false;
            break;
    }
}

const clearHands = () => {
    dealerCards.innerHTML = "";
    playerCards.innerHTML = "";
    message.innerHTML = "";
    playerHand.hand = [];
    dealerHand.hand = [];
}

newRoundBtn.addEventListener('click', function(){
    setDealerFaceValue(0);
    setPlayerFaceValue(0);
    playerValue = 0;
    dealerValue = 0;
    playerASetToOne = false;
    dealerASetToOne = false;
    clearHands();
    startRound();
})

const startRound = () => {
    hitBtn.disabled = false;
    standBtn.disabled = false;
    if(deck.cards.length < 4){
        message.innerHTML = 'sorry, there is no more cards';
        restartBtn.disabled = false;
        return;
    }
    message.innerHTML = "";
    restartBtn.disabled = true;
    newRoundBtn.disabled = true;
    const initDealerCard = deck.popTwoCards();
    const initPlayerCard = deck.popTwoCards();

    initPlayerCard.map((item) => {
        addCard('player', item);
        playerValue = playerValue + cardFaceValue(item.value, false);
        setPlayerFaceValue(playerValue)
    })
    addCard('dealer', initDealerCard[0]);
    addCard('dealer', initDealerCard[1]);
    const faceDownCard = document.querySelectorAll('.dealer-side .dealer-cards .card')[1]
    faceDownCard.classList.add('facedown');
    dealerValue = dealerValue + cardFaceValue(dealerHand.hand[0].value, false);
    setDealerFaceValue(dealerValue)
    dealerFaceDownCardValue = cardFaceValue(dealerHand.hand[1].value, false);
}

hitBtn.addEventListener('click', () => {
    const addedCard = deck.popCard()
    addCard('player', addedCard);
    playerValue = playerValue + cardFaceValue(addedCard.value, false);
    setPlayerFaceValue(playerValue)
    if(playerValue > 21){
        if(handHasA(playerHand.hand) === true && playerASetToOne === false){
            playerValue = playerValue - 10;
            playerASetToOne = true;
            setPlayerFaceValue(playerValue);
            return;
        }
        playerLost();
        hitBtn.disabled = true;
        standBtn.disabled = true;
        enableButton('new-round');
        return;
    }
})

standBtn.addEventListener('click', async () => {
    flipDealerCard();
    hitBtn.disabled = true;
    standBtn.disabled = true;
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    while(dealerValue < 17 || dealerValue < playerValue){
        const addedCard = deck.popCard();
        addCard('dealer', addedCard);
        dealerValue = dealerValue + cardFaceValue(addedCard.value, false);
        setDealerFaceValue(dealerValue)
        // addingCardToDealer()
        await sleep(1500)
    }
    
    if(dealerValue > 21){
        if(handHasA(dealerHand.hand) === true && dealerASetToOne === false){
            dealerValue = dealerValue - 10;
            dealerASetToOne = true;
            setDealerFaceValue(dealerValue);
            while(dealerValue < 17 || dealerValue < playerValue){
                const addedCard = deck.popCard();
                addCard('dealer', addedCard);
                dealerValue = dealerValue + cardFaceValue(addedCard.value, false);
                setDealerFaceValue(dealerValue)
                // addingCardToDealer()
                await sleep(1500)
            }
            if(dealerValue > 21) {
                playerWon();
                enableButton('new-round');
                return;
            }
            if(dealerValue == playerValue){
                tieGame();
            }
            if(dealerValue < playerValue) {
                playerWon();
                enableButton('new-round');
                return;
            }
            
        } else {
            playerWon();
            enableButton('new-round');
            return
        }
    }
    if(dealerValue == playerValue){
        tieGame();
    }
    playerLost();
    enableButton('new-round');
})
