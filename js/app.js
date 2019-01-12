/*----- constants -----*/

screenWidth = 800; // temporary - to be discovered dynamically
screenHeight = 500;

const timerLength = 15;

const rateMap = require('../assets/levels');
const Person = require('../js/Person');
const Asteroid = require('../js/Asteroid');
const Medic = require('../js/Medic');
const Oxygen = require('../js/Oxygen');

/*----- app's state (variables) -----*/

game = null; // temporary, shall be called otherwise
let person;

class Game {
  constructor(){
    this.projectiles = ['asteroids', 'medics', 'oxygens'];
    
    this.makeElements();
    this.attachKeyListeners();
    this.newGame();
    
    this.createStatusBars();
    this.createTimer();
  }
  newGame() {
    this.round = 0;
    this.asteroidCounter = 0;
    this.medicCounter = 0;
    this.oxygenCounter = 0;

    this.projectiles.forEach((projectile) => {this[projectile] = []})

    // create astronaut
    this.person = new Person();

    this.newRound();
  }
  newRound() {
    this.round++;
    this.active = true;
    this.timer = 30;
    // destroy all projectiles
    if (this.round > 0) this.destroyProjectiles();

    this.roundNumber.textContent = this.round;
    this.levelRates = rateMap[`Level${this.round}`];

    this.person.entryAnimation();
    this.startCountdown();
  }
  startCountdown() {
    let count = 3;
    const countdownElement = document.createElement('h3');
    countdownElement.textContent = count;
    const countdownBox = document.createElement('section');
    countdownBox.classList.add('countdown');
    const overLay = document.createElement('div');
    overLay.classList.add('over-content');    

    countdownBox.appendChild(countdownElement);
    overLay.appendChild(countdownBox);
    content.appendChild(overLay);
    const countdownInterval = setInterval(() => {
      if (count <= 1) {
        clearInterval(countdownInterval);
        countdownBox.removeChild(countdownElement);
        overLay.removeChild(countdownBox);
        content.removeChild(overLay);
        this.startRound();
      }
      count--;
      countdownElement.textContent = count;
    }, 1000)
  }
  startRound() {
    this.releaseAsteroids();
    this.releaseMedics();
    this.releaseOxygen();
    this.resetTimer(timerLength); 
    this.startTimer();
    
    this.person.setAirLoss(true);
  }
  attachKeyListeners() {
    // prevent scrolling
    window.addEventListener("keydown", function(e) {
      if(['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(e.code) > -1) {
          e.preventDefault();
      }
    }, false);

    // attach key event listeners
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  keyDetect (e) {
    let x = (this.keys['ArrowLeft'] ? -1 : 0) + (this.keys['ArrowRight'] ? 1 : 0);
    let y = (this.keys['ArrowUp'] ? -1 : 0) + (this.keys['ArrowDown'] ? 1 : 0);
    x *= rateMap.Astronaut.speed;
    y *= rateMap.Astronaut.speed;
    if (x !== 0 || y !== 0) {
      this.person.move([x, y]);
    };
    if (this.active) setTimeout(() => {this.keyDetect()}, 20);
  }
  createStatusBars() {
    this.healthProgress = document.createElement('progress');
    this.healthProgress.classList.add('health-progress');
    this.healthProgress.setAttribute('max', 100);
    this.healthProgress.setAttribute('value', this.person.health);
    this.healthProgress.setAttribute('id', 'health-progress')
    const healthLabel = document.createElement('label');
    healthLabel.setAttribute('for', 'health-progress')
    healthLabel.textContent = 'Health';

    this.airProgress = document.createElement('progress');
    this.airProgress.classList.add('air-progress');
    this.airProgress.setAttribute('max', 100);
    this.airProgress.setAttribute('value', this.person.air);
    this.airProgress.setAttribute('id', 'air-progress');
    const airLabel = document.createElement('label');
    airLabel.setAttribute('for', 'air-progress');
    airLabel.textContent = 'Oxygen';

    this.progressBox = document.createElement('section');
    this.progressBox.classList.add('progress-box')

    this.progressBox.appendChild(healthLabel);
    this.progressBox.appendChild(this.healthProgress);
    this.progressBox.appendChild(document.createElement('br'))
    this.progressBox.appendChild(airLabel);
    this.progressBox.appendChild(this.airProgress);

    content.appendChild(this.progressBox);
  }
  makeElements() {

    // Level Information
    this.roundBox = document.createElement('section');
    this.roundBox.classList.add('round-box');
    this.roundLabel = document.createElement('label');
    this.roundLabel.textContent = 'Level: ';
    this.roundNumber = document.createElement('span');
    this.roundNumber.textContent = this.round;
    this.roundBox.appendChild(this.roundLabel);
    this.roundBox.appendChild(this.roundNumber);
    content.appendChild(this.roundBox);

    // Round Over Elements
    this.nextRoundBtn = document.createElement('button');
    this.nextRoundBtn.classList.add('next-round-btn')
    this.nextRoundBtn.textContent = 'Next Level';
    this.nextRoundBtn.addEventListener('click', () => {
      this.newRound();
      overScreenBackground.removeChild(this.roundOverContainer);
      content.removeChild(overScreenBackground);
      this.person.reset();
    });
    
    roundOverMsg.classList.add('round-over');

    this.roundOverContainer = document.createElement('section');
    this.roundOverContainer.classList.add('round-over-container');    

    // Game Completed Elements
    this.gameCompleteContainer = document.createElement('section');
    this.gameCompleteContainer.classList.add('game-complete-container');
    this.gameCompleteMessage = document.createElement('h3');
    this.gameCompleteMessage.textContent = 'Game Completed'
    this.gameCompleteSubmessage = document.createElement('h4');
    this.gameCompleteSubmessage.textContent = 'Check back later for more levels!';
    
    this.newGameBtn = document.createElement('button');
    this.newGameBtn.textContent = 'Play Again'
    this.newGameBtn.classList.add('play-again-btn');
    this.newGameBtn.addEventListener('click', () => {
      // destroy game
      this.endGame();
      this.newGame();
    });
    
    this.gameCompleteContainer.appendChild(this.gameCompleteMessage);
    this.gameCompleteContainer.appendChild(this.gameCompleteSubmessage);
    this.gameCompleteContainer.appendChild(this.newGameBtn);

  }
  endGame() {
    overScreenBackground.removeChild(this.gameCompleteContainer);
    content.removeChild(overScreenBackground);
    this.destroyProjectiles();
    this.person.div.remove();
    this.person = null;
  }
  destroyProjectiles() {
    this.projectiles.forEach((type) => {
      for (let i = this[type].length - 1; i >= 0; i--) {
        const projectile = this[type][i];
        projectile.completesPath();
      }
    })
  }
  gameOver(cause) {
    $(content).append($gameOverMsg);
    content.removeChild(this.levelOver);
    this.active = false;

    this.stopIntervals();
    this.stopProjectiles();
  }
  levelOver() {
    this.active = false;
    this.stopIntervals();
    this.stopProjectiles();
    
    content.appendChild(overScreenBackground);

    if (rateMap[`Level${this.round + 1}`]) {
      roundOverMsg.textContent = `Level ${this.round} Complete!`;

      this.roundOverContainer.appendChild(roundOverMsg);
      this.roundOverContainer.appendChild(this.nextRoundBtn);
      overScreenBackground.appendChild(this.roundOverContainer);
    } else { // game completed!
      overScreenBackground.appendChild(this.gameCompleteContainer);
    }
    // make next round button appear
    overScreenBackground.classList.remove('hidden');
  }
  stopIntervals() {
    clearInterval(this.asteroidInterval);
    clearInterval(this.person.setAirLoss(false));
    // clearInterval(this.timerInterval);
    clearInterval(this.medicReleaseInterval);
    clearInterval(this.oxygenReleaseInterval);
  }
  releaseAsteroids() {
    this.asteroidInterval = setInterval(() => {
      const asteroid = new Asteroid(this.asteroidCounter++, this.levelRates.asteroid.speed);
      asteroid.release();
      this.asteroids.push(asteroid);
    }, 1000 / (this.levelRates.asteroid.rate / 60));
  }
  releaseMedics(rate) {
    // rate is # of releases per minute;
    // speed => duration = 10000 / speed
    this.medicReleaseInterval = setInterval(() => {
      // idNumber, speed
      const medic = new Medic(this.medicCounter++, this.levelRates.medic.speed);
      this.medics.push(medic);
      medic.release();
    }, 1000 / (this.levelRates.medic.rate / 60));
  }
  releaseOxygen(rate, duration) {
    // rate is # of releases per minute;
    this.oxygenReleaseInterval = setInterval(() => {
      const oxygen = new Oxygen(this.oxygenCounter++, this.levelRates.oxygen.speed);
      this.oxygens.push(oxygen);
      oxygen.release(duration);
    }, 1000 / (this.levelRates.oxygen.rate / 60));
  }
  stopProjectiles() {
    this.projectiles.forEach((proj) => {
      for (let i = 0; i < this[proj].length; i++) {
        this[proj][i].animation.pause();
      }
    })
  }
  createTimer() {
    this.timerElement = document.createElement('progress');
    this.timerElement.setAttribute('max', this.timer);
    this.timerElement.setAttribute('value', this.timer);
    this.timerElement.setAttribute('id', 'timer');

    this.timerLabel = document.createElement('label');
    this.timerLabel.textContent = 'Timer';
    this.timerLabel.setAttribute('for', 'timer');

    this.timerSection = document.createElement('section');
    this.timerSection.classList.add('timer-section');

    this.timerSection.appendChild(this.timerLabel);
    this.timerSection.appendChild(this.timerElement);

    content.appendChild(this.timerSection);
  }
  resetTimer(start) {
    this.timerElement.setAttribute('max', start);
    this.timerElement.setAttribute('value', this.timer);
    this.timer = start;
  }
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.levelOver();
      }
      anime({
        targets: this.timerElement,
        value: this.timer,
        round: 1,
        duration: 0,
        easing: 'linear'
      });      
    }, 1000)
  }
} 

/*----- cached element references -----*/

const content = document.querySelector('#content');
const initActions = document.createElement('section');
const $gameOverMsg = $('<h2>Game Over</h2>').addClass('game-over');
const $howToBtn = $('<button/>').text('How to Play');
const roundOverMsg = document.createElement('h2');
const overScreenBackground = document.createElement('div');

/*----- event listeners -----*/

document.querySelector('.back-btn').addEventListener('click', () => {
  document.querySelector('#instructions').classList.toggle('hidden');
  initActions.classList.toggle('hidden');
});
$howToBtn.click(() => {
  document.querySelector('#instructions').classList.toggle('hidden');
  initActions.classList.toggle('hidden');
});

/*----- functions -----*/

init();

function init() {

  const $startBtn = $('<button/>').text('Start Game').on('click', newGame);
  $(initActions).append($startBtn);  
  $(initActions).append($howToBtn);
  $(initActions).addClass('initial-actions')
  content.appendChild(initActions);

  overScreenBackground.classList.add('over-content');
}

function newGame() {
  content.removeChild(initActions);
  game = new Game();
}