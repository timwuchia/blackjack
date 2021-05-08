import Deck, { DealerHand, PlayerHand } from './deck.js';


const deck = new Deck();
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
const dealerFaceValue = document.querySelector('.dealer-side #dealer-value');
const playerFaceValue = document.querySelector('.player-side #player-value');
const hitBtn = document.querySelector('.hit-btn');
const standBtn = document.querySelector('.stand-btn');
const newRoundBtn = document.querySelector('.new-round-btn');
const message = document.querySelector('.deck .message');

document.addEventListener("DOMContentLoaded", () => {
    startRound();
})

const setDealerFaceValue = (value) => {
    dealerFaceValue.innerHTML = value;
}

const setPlayerFaceValue = (value) => {
    playerFaceValue.innerHTML = value;
}




const playerLost = () => {
    message.innerHTML = 'Sorry, you lost';
}

const playerWon = () => {
    message.innerHTML = "You won!!";
}

const tieGame = () => {
    message.innerHTML = "It's a tie!!";
}

const cardFaceValue = (cardValue, aIsOne) => {
    switch(cardValue){
        case "A":
            return !aIsOne ? 11 : 1;
            break;
        case "2":
            return 2;
            break;
        case "3":
            return 3;
            break;
        case "4":
            return 4;
            break;
        case "5":
            return 5;
            break;
        case "6":
            return 6;
            break;
        case "7":
            return 7;
            break;
        case "8":
            return 8;
            break;
        case "9":
            return 9;
            break;
        case "10":
        case "J":
        case "Q":
        case "K":
            return 10;
            break;
    }
}

const flipDealerCard = () => {
    dealerValue = dealerValue + dealerFaceDownCardValue;
    setDealerFaceValue(dealerValue)
}

const addCard = (side, card) => {
    console.log(deck)
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
    const initDealerCard = deck.popTwoCards();
    const initPlayerCard = deck.popTwoCards();
    // initDealerCard.map((item) => {
    //     addCard('dealer', item);
    // })
    initPlayerCard.map((item) => {
        addCard('player', item);
        playerValue = playerValue + cardFaceValue(item.value, false);
        setPlayerFaceValue(playerValue)
    })
    addCard('dealer', initDealerCard[0]);
    addCard('dealer', initDealerCard[1]);
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
        enableButton('new-round');
        return;
    }
})

const handHasA = (hand) => {
    for(let i = 0; i < hand.length; i++){
        if(hand[i].value === "A") return true;
    }
    return false;
}

setTimeout(() => {
    handHasA(playerHand.hand)
}, 1000)


standBtn.addEventListener('click', async () => {
    flipDealerCard();
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
            await addCardToDealer(true);
            if(dealerValue > 21) {
                playerWon();
                enableButton('new-round');
                return;
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
    playerLost();
    enableButton('new-round');
})
