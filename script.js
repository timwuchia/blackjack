import Deck, { DealerHand, PlayerHand } from './deck.js';


const deck = new Deck();
deck.shuffle();
const playerHand = new PlayerHand;
const dealerHand = new DealerHand;
let dealerFaceDownCardValue = 0;
let playerValue = 0;
let dealerValue = 0;

const dealerDeck = document.querySelector('.dealer-side');
const playerDeck = document.querySelector('.player-side');
const dealerFaceValue = document.querySelector('.dealer-side #dealer-value');
const playerFaceValue = document.querySelector('.player-side #player-value');
const hitBtn = document.querySelector('.hit-btn');
const standBtn = document.querySelector('.stand-btn');
const message = document.querySelector('.deck .message');

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

const cardFaceValue = (cardValue, setAToOne) => {
    switch(cardValue){
        case "A":
            return !setAToOne ? 11 : 1;
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
    if(side === 'player'){
        playerHand.hand.push(card)
        playerDeck.append(card.getHTML());
        console.log(playerHand)
    }
    if(side === 'dealer'){
        dealerHand.hand.push(card)
        dealerDeck.append(card.getHTML());
        
    } 
}

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
    // playerHand.initCard(initPlayerCard);
    // dealerHand.initCard(initDealerCard);
    // playerHand.hand.map((item) => {
    //     addCard('player', item);
    //     playerValue = playerValue + cardFaceValue(item.value);
    //     setPlayerFaceValue(playerValue)
    // })
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
        playerLost();
    }
    console.log(playerValue);
})

const handHasA = (hand) => {
    // console.log(hand)
    for(let i = 0; i < hand.length; i++){
        if(hand.value === "A") return true;
    }
    return false;
}

setTimeout(() => {
    handHasA(playerHand.hand)
}, 1000)



standBtn.addEventListener('click', async () => {
    flipDealerCard();
    
    const addCardToDealer = async (setAToOne) => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const addedCard = deck.popCard();
                addCard('dealer', addedCard);
                dealerValue = dealerValue + cardFaceValue(addedCard.value, setAToOne);
                setDealerFaceValue(dealerValue)
                console.log(dealerValue)
                if(dealerValue > 17 && dealerValue > playerValue) clearInterval(interval);
            }, 1500);
            // return
        })
    }
    console.log('jasdfjashdfjk')
    const res = await addCardToDealer(false);
    
    if(dealerValue > 21){
        if(handHasA(dealerHand.hand)){
            dealerValue = dealerValue - 10
            setDealerFaceValue(dealerValue);
            await addCardToDealer(true);
            if(dealerValue > 21) {
                playerWon();
                return;
            }
            if(dealerValue < playerValue) {
                playerWon();
                return;
            }
            
        } else {
            playerWon();
        }
    }
    console.log('player lost')
    playerLost();
})

startRound();