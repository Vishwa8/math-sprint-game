// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

const bestScoresToDOM = () => {
  bestScores.forEach((bestScore, i) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[i].bestScore}s`;
  });
};

const getSavedBestScores = () => {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
};

const updateBestScores = () => {  
  bestScoreArray.forEach((bestScore) => {      
    if (bestScore.questions == questionAmount
      && (Number(bestScore.bestScore) === 0 || bestScore.bestScore > finalTime)) {
        bestScore.bestScore = finalTime.toFixed(1);
    }
  });    
  bestScoresToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray)); 
};

const playAgain = () => {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  questionAmount = 0;
  equationsArray = [];
  playerGuessArray = [];
  firstNumber = 0;
  secondNumber = 0;
  equationObject = {};
  valueY = 0;
  playAgainBtn.hidden = true;
};

const displayScorePage = () => {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
};

const scoresToDOM = () => {
  baseTimeEl.textContent = `Base Time: ${timePlayed.toFixed(1)}s`;
  penaltyTimeEl.textContent = `Penalty: ${penaltyTime.toFixed(1)}s`;
  finalTimeEl.textContent = `${finalTime.toFixed(1)}s`;
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  displayScorePage();
  }

const checkPenalty = () => {
  playerGuessArray.forEach((guess, i) => {
    if (guess != equationsArray[i].evaluated) {
      penaltyTime += 0.5;
      console.log('penalty');
    }
  });
  return penaltyTime;
}

const checkTime = () => {  
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) { 
    console.log(playerGuessArray);
    console.log(equationObject);
    clearInterval(timer);
    finalTime = timePlayed + checkPenalty();
    console.log(finalTime);
    updateBestScores();
    scoresToDOM();
  };
};

const addTime = () => {
  timePlayed += 0.1;
  checkTime();
};

const startTimer = () => {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
};

const select = (guess) => {
  valueY += 80;
  itemContainer.scroll(0, valueY);
  return playerGuessArray.push(guess);
};

const displayGamePage = () => {
  gamePage.hidden = false;
  countdownPage.hidden = true;
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }

  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
  console.log(equationsArray);
}

const equationToDOM = () => {   
  equationsArray.forEach((equation) => {
    const item = document.createElement('div');
    item.classList.add('item');

    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
};

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

const countdownStart = () => {   
  countdown.textContent = '3';
  setTimeout(() => { 
    countdown.textContent = '2';
  }, 1000); 
  setTimeout(() => { 
    countdown.textContent = '1';
  }, 2000); 
  setTimeout(() => { 
    countdown.textContent = 'Go!';
  }, 3000); 
};

const showCountDown = () => {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(displayGamePage, 4000);
};

const getRadioValue = () => {
  let radioValue = 0;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
};

const selectQuestionAmount = (e) => {
  e.preventDefault();

  questionAmount = getRadioValue();

  if (questionAmount) showCountDown();
};

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove('selected-label');
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

getSavedBestScores();