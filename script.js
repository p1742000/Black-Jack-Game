
// BlackJack game

// STEPS TO GET INTO THE BLACKJACK LOGIC :-

// 1.) first we need to make buttons clickable. (for that here we have used eventlistener on the buttons.)
// 2.) Now, look into the game. You observe that when we click "Hit" button, cards are popped up into the div(#your-box). and also
// your score gets updated. So, that is also inside span tag.(#your-blackjack-result). So, these things can be taken care with
// 1 variable only. by making object of these things. that we have made 



let blackJackGame = {
    'You': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'Computer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isHit': false,
    'isStand': false,
    'turnsOver': false,
}


// These 'you' and 'computer' is not going to change in whole code. and it should not change as we access everything mainly by them.So,
const YOU = blackJackGame['You'];
const COMPUTER = blackJackGame['Computer'];


// "querySelector" is "CSS Selector". it is far more better than "getElementById", "getElementByClassName", "getElementByTagName" etc...
// 1.) Adding event Listeners to all 3 buttons
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);


// Hit button's logic
function blackjackHit() {
    if (blackJackGame['isStand'] === false) {  // if stand button is running, then hit should't work at the same time.
        blackJackGame['isHit'] = true;
        let card = randomCard();    // this will generate random cards
        showCards(card, YOU);       // popped up cards into respective div sections
        updateScore(card, YOU);     // according to which card popped in div, score needs to update.
        console.log(YOU['score']);
        showScore(YOU);             
    }

}

// How this function parameter decided ?
// ANS :- which card is there, that we must needed bec, based on that only we calculate the score.
// and second thing is which player's score is updating, that active player also we must know at this point.
// 4.) updating the score of individuals
function updateScore(card, activePlayer) {

    // If adding 11 keeps me below 21, then add 11. Otherwise add 1.
    if (card === 'A') {
        if (activePlayer['score'] + blackJackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackJackGame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackJackGame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
}

// 5.) showing individual's score in the screen/DOM
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

// 2.) function to generate random cards
function randomCard() {
    let randCardPicker = Math.floor(Math.random() * 13);
    return blackJackGame['cards'][randCardPicker];     // this returns a random number upto 13.
}

// 3.) function to popeed up cards in respective divs
function showCards(card, activePlayer) {
    // alert('Oouch! You Hit Me!!');
    if (activePlayer['score'] <= 21) {
        let image = document.createElement('img');  // creating img tag
        image.src = `images/${card}.png`;          // accessing img tag's src attribute
        document.querySelector(activePlayer['div']).appendChild(image); // put this element in div
    }
}

// 6.) RESET BUTTON LOGIC (i.e. DEAL BUTTON)
function blackjackDeal() {

    if (blackJackGame['turnsOver'] === true) {
        // showResult(computeWinner());
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        let ComputerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (let i = 0; i < ComputerImages.length; i++) {
            ComputerImages[i].remove();
        }
        YOU['score'] = 0;
        COMPUTER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'black';
        document.querySelector('#dealer-blackjack-result').style.color = 'black';

        // correcting "Let's play" while clicking "deal" button.
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';
        blackJackGame['isHit'] = false;
        blackJackGame['isStand'] = false;
        blackJackGame['turnsOver'] = false;
    }

}

// Make computer play automatic (after clicking "Stand" button)

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// second Player Logic
async function dealerLogic() {

    if (blackJackGame['isHit'] === true) {
        blackJackGame['isStand'] = true;

        while (COMPUTER['score'] < 16 && blackJackGame['isStand'] === true) {
            let card = randomCard();
            showCards(card, COMPUTER);
            updateScore(card, COMPUTER);
            // console.log(COMPUTER['score']);
            showScore(COMPUTER);
            await sleep(1000);
        }

        blackJackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);

        

    }

    blackJackGame['isHit'] = false;   



}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // condition: higher score than dealer or when dealer busts but you are lesser than 21.
        if (YOU['score'] > COMPUTER['score'] || (COMPUTER['score'] > 21)) {
            blackJackGame['wins']++;
            // console.log('You won!');
            winner = YOU;
        } else if (YOU['score'] < COMPUTER['score']) {
            blackJackGame['losses']++;
            // console.log('You lost!');
            winner = COMPUTER;
        } else if (YOU['score'] === COMPUTER['score']) {
            blackJackGame['draws']++;
            // console.log('Match Drawn!');
        }
    }
    // condition : when user busts but computer doesn't
    else if (YOU['score'] > 21 && COMPUTER['score'] <= 21) {
        blackJackGame['losses']++;
        // console.log('You lost!');
        winner = COMPUTER;
    }
    // condition : when you and computer busts
    else if (YOU['score'] > 21 && COMPUTER['score'] > 21) {
        blackJackGame['draws']++;
        // console.log('Match Drawn!');
    }

    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (winner === YOU) {
        document.querySelector('#wins').textContent = blackJackGame['wins'];  // Updating table data
        message = 'You won!';
        messageColor = 'green';
    }
    else if (winner === COMPUTER) {
        document.querySelector('#losses').textContent = blackJackGame['losses'];  // Updating table data
        message = 'You lost!';
        messageColor = 'red';
    }
    else {
        document.querySelector('#draws').textContent = blackJackGame['draws']; // Updating table data
        message = 'Match Drawn!';
        messageColor = 'black';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
}