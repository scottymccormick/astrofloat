/*----- constants -----*/

const screenWidth = 800;
const screenHeight = 500;

const timerLength = 3;

const rateMap = {
  Astronaut: {
    speed: 1.9
  },
  Level1: {
    asteroid: {
      rate: 25,
      speed: 1.5,
      spread: 1,
    },
    oxygen: {
      rate: 8,
      speed: 1.4,
      spread: 1,
    },
    medic: {
      rate: 9,
      speed: 1.5,
      spread: 1,
    }
  },
  Level2: {
    asteroid: {
      rate: 18,
      speed: 2,
      spread: 1,
    },
    oxygen: {
      rate: 14,
      speed: 2,
      spread: 1,
    },
    medic: {
      rate: 12,
      speed: 2,
      spread: 1,
    }
  }, 
  Level3: {
    asteroid: {
      rate: 20,
      speed: 3,
      spread: 1.1,
    },
    oxygen: {
      rate: 16,
      speed: 2,
      spread: 1.2,
    },
    medic: {
      rate: 10,
      speed: 3,
      spread: 1.2,
    }
  }
}

/*----- app's state (variables) -----*/

let game, person;

class Mass {
  constructor(width, height, type) {
    this.div = document.createElement('div');
    this.div.classList.add(type);
    this.dimensions = {x: width, y: height};
    this.position = {x: 0, y: 0};
  }
  getPosition() {
    const parentPos = content.getBoundingClientRect();
    const childPos = this.div.getBoundingClientRect();
    return {x: childPos.left - parentPos.left, y: childPos.top - parentPos.top};
  }
  intersects(obj) {
    let objAPos = this.getPosition();
    let objBPos = obj.getPosition();

    return (objAPos.x > (objBPos.x - obj.dimensions.x) && 
        objAPos.x < (objBPos.x + obj.dimensions.x) &&
        objAPos.y > (objBPos.y - obj.dimensions.y) && 
        objAPos.y < (objBPos.y + obj.dimensions.y));
  }
}

class Projectile extends Mass {
  constructor(width, height, type, speed) {
    super(width, height, type);
    this.active = true;
    this.speed = game.levelRates[type].speed;
    this.spread = game.levelRates[type].spread;
  }
  release(duration) {
    const points = this.createPaths();

    this.move(points[0], 0, false);
    this.animation = this.move(points[1], 10000 / this.speed, true);
  }
  createPaths() {
    const axis = Math.random() > 0.5 ? 'x' : 'y';
    const direction = Math.random() > 0.5 ? '+' : '-';
    
    const startPoint = this.generatePoint(axis, direction);
    const endPoint = this.generatePoint(axis, direction, startPoint)
    return [startPoint, endPoint];
  }
  generatePoint(axis, direction, startPoint) {
    const point = [0, 0];
    if (!startPoint) {
      if(axis === 'x') {
        point[0] = direction === '+' ? -this.dimensions.x : screenWidth;
        point[1] = Math.random() * (screenHeight + this.dimensions.y) - this.dimensions.y;
      } else { // axis === 'y'
        point[0] = Math.random() * (screenWidth + this.dimensions.x) - this.dimensions.x;
        point[1] =  direction === '+' ? -this.dimensions.y : screenHeight;
      }
    } else { // startPoint exists
      if (axis === 'x') {
        point[0] = (direction === '+' ? 1 : -1) * (screenWidth + this.dimensions.x); 
        point[1] = (Math.random() * this.spread * (screenHeight + this.dimensions.y)) - startPoint[1];
      } else { // axis === 'y'
        point[0] = (Math.random() * this.spread * (screenWidth + this.dimensions.x)) - startPoint[0];
        point[1] = (direction === '+' ? 1 : -1) * (screenHeight + this.dimensions.y);
      }
    }
    return point;
  }
  move ([x, y], time, end) {
    return anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      duration: time,
      easing: 'linear',
      elasticity: 0,
      run: (anim) => {
        if (this.intersects(person) && this.active) {
          this.collides();
        }
      },
      complete: () => {
        if (end) {
          this.completesPath()
        }
      }
    });
  }
  collides() {
    // does something
    console.log(`Collision with something`);
  }
  completesPath() {
    this.div.remove();
  }
}

class Asteroid extends Projectile {
  constructor(idNumber) {
    super(50, 50, 'asteroid');
    this.id = `asteroid-${idNumber}`;
    content.appendChild(this.div);
  }
  completesPath() {
    const deadIdx = game.asteroids.findIndex((asteroid) => {
      return asteroid.id === this.id;
    });
    game.asteroids.splice(deadIdx, 1);
    super.completesPath();
  }
  collides() {
    this.div.style.backgroundColor = 'purple'; // add hit animation
    person.affectStatus(-1, 'health');
  }
}

class Medic extends Projectile {
  constructor(idNumber, speed) {
    super(40, 40, 'medic', speed);
    this.id = `medic-${idNumber}`;
  }
  collides() {
    this.active = false;
    person.affectStatus(50, 'health');
    super.completesPath();
  }
  release() {
    content.appendChild(this.div);
    super.release();
  }
  completesPath() {
    const deadIdx = game.medics.findIndex((medic) => {
      return medic.id === this.id;
    });
    game.medics.splice(deadIdx, 1);
    super.completesPath();
  }
}

class Oxygen extends Projectile {
  constructor(idNumber) {
    super(30, 30, 'oxygen');
    this.div.innerHTML = 'O<sub>2</sub>'
    this.id = `oxygen-${idNumber}`;
  }
  collides() {
    this.active = false;
    person.affectStatus(30, 'air');
    super.completesPath();
  }
  release() {
    content.appendChild(this.div);
    super.release();
  }
  completesPath() {
    const deadIdx = game.oxygens.findIndex((oxygen) => {
      return oxygen.id === this.id;
    });
    game.oxygens.splice(deadIdx, 1);
    super.completesPath();
  }
}

class Person extends Mass {
  constructor() {
    super(50, 50, 'astronaut');
    this.health = 100;
    this.air = 100;
    this.animationDuration = 2100;
    content.appendChild(this.div);

    this.entryAnimation();
  }
  entryAnimation() {
    let that = this;
    const initialX = (screenWidth / 2) - (this.dimensions.x / 2);
    const initialY = (screenHeight / 2) - (this.dimensions.y / 2);
    anime({
      targets: that.div,
      translateX: [{value: initialX, duration: 0}],
      translateY: [{value: initialY, duration: 0}],
      scale: [
        {value: 0, duration: 100},
        {value: 1, duration: 2000, delay: 100}
      ],
      opacity: [{value: 1, delay: 100, duration: 1000}],
      rotate: [{value: '2turn', delay: 100, duration: 2000}],
      complete: function(anim) {
        that.position.x = initialX;
        that.position.y = initialY;
        // temporarily delay onset on keyDetection
        setTimeout(() => {game.keyDetect()}, 30);
      }
    });
  }
  affectStatus (amount, type) {
    const attribute = type;
    const progress = `${type}Progress`;
    if (amount + this[attribute] > 100) {
      this[attribute] = 100;
    } else {
      this[attribute] += amount;
    }
    
    anime({
      targets: game[progress],
      value: this[attribute],
      duration: 0,
      easing: 'linear'
    });
    if (this[attribute] === 0) {
      game.gameOver();
    }
  }
  setAirLoss(toLose) {
    if (toLose) {
      this.airInterval = setInterval(() => {
        if (this.air <= 0) {
          game.gameOver();
        }
        this.air -= 0.25;
        anime({
          targets: game.airProgress,
          value: this.air,
          duration: 1,
          easing: 'linear'
        });
      }, 100)
    } else {
      clearInterval(this.airInterval);
    }
  }
  move ([x, y]) {
    anime({
      targets: this.div, 
      translateX: this.position.x += x,
      translateY: this.position.y += y,
      elasticity: 0,
      duration: 100
    });
    
    // detect if out of bounds
    if (this.position.x < -this.dimensions.x || 
      this.position.y < -this.dimensions.y ||
      this.position.y > screenHeight ||
      this.position.x > screenWidth) game.gameOver()
  }
  reset() {
    this.health = 100;
    this.air = 100;
    this.entryAnimation();
  }
}

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
    person = new Person();

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

    // Add countdown that refills timer too
    // this.startCountdown()
    setTimeout(() => {this.startRound()}, person.animationDuration);
  }
  startRound() {
    this.releaseAsteroids();
    this.releaseMedics();
    this.releaseOxygen();
    this.resetTimer(timerLength); // temporary global constant
    this.startTimer();
    // begin losing oxygen
    person.setAirLoss(true);
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
    console.log(this.keys)
    let x = (this.keys['ArrowLeft'] ? -1 : 0) + (this.keys['ArrowRight'] ? 1 : 0);
    let y = (this.keys['ArrowUp'] ? -1 : 0) + (this.keys['ArrowDown'] ? 1 : 0);
    x *= rateMap.Astronaut.speed;
    y *= rateMap.Astronaut.speed;
    console.log(x,y)
    if (x !== 0 || y !== 0) {
      person.move([x, y]);
    };
    if (this.active) setTimeout(() => {this.keyDetect()}, 20);
  }
  createStatusBars() {
    this.healthProgress = document.createElement('progress');
    this.healthProgress.setAttribute('max', 100);
    this.healthProgress.setAttribute('value', person.health);
    this.healthProgress.setAttribute('id', 'health-progress')
    const healthLabel = document.createElement('label');
    healthLabel.setAttribute('for', 'health-progress')
    healthLabel.textContent = 'Health';

    this.airProgress = document.createElement('progress');
    this.airProgress.setAttribute('max', 100);
    this.airProgress.setAttribute('value', person.air);
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
      // this.startRound();
      overScreenBackground.removeChild(this.roundOverContainer);
      content.removeChild(overScreenBackground);
      person.reset();
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
    person.div.remove();
    person = null;
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
    clearInterval(person.setAirLoss(false));
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
const roundOverMsg = document.createElement('h2');
const overScreenBackground = document.createElement('div');

/*----- event listeners -----*/

/*----- functions -----*/

init();

function init() {
  console.log('Astrofloat initializted');

  // Add first buttons
  const $startBtn = $('<button/>').text('Start Game').on('click', newGame);
  $(initActions).append($startBtn);

  const $howToBtn = $('<button/>').text('How to Play');
  $(initActions).append($howToBtn);

  $(initActions).addClass('initial-actions')
  content.appendChild(initActions);

  // Style Messages

  overScreenBackground.classList.add('over-content');

}

function newGame() {
  content.removeChild(initActions);

  game = new Game();
}