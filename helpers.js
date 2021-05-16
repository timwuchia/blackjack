// get the faceValue of the card
const dealerFaceValue = document.querySelector('.dealer-side #dealer-value');
const playerFaceValue = document.querySelector('.player-side #player-value');
const message = document.querySelector('.deck .message');

export const cardFaceValue = (cardValue, aIsOne) => {
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

// check if hand has A
export const handHasA = (hand) => {
    for(let i = 0; i < hand.length; i++){
        if(hand[i].value === "A") return true;
    }
    return false;
}

// set dealer and player value

export const setDealerFaceValue = (value) => {
    dealerFaceValue.innerHTML = value;
}

export const setPlayerFaceValue = (value) => {
    playerFaceValue.innerHTML = value;
}

// set winner

export const playerLost = () => {
    message.innerHTML = 'Sorry, you lost';
}

export const playerWon = () => {
    message.innerHTML = "You won!!";
}

export const tieGame = () => {
    message.innerHTML = "It's a tie!!";
}